package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.repositories.VolonterInfoRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class KorisnikServices {

    private final KorisnikRepository korisnikRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final LogAktivnostiService logService;
    private final VolonterInfoRepository volonterInfoRepository;

    public KorisnikServices(KorisnikRepository korisnikRepository,
                            PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager,
                            EmailService emailService,
                            LogAktivnostiService logService,
                            VolonterInfoRepository volonterInfoRepository) {
        this.korisnikRepository = korisnikRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.logService = logService;
        this.volonterInfoRepository = volonterInfoRepository;
    }

    // ===================== REGISTRACIJA =====================

    public Korisnik registrujKorisnika(Korisnik korisnik) {
        // Provjera duplikata emaila
        if (korisnikRepository.existsByEmail(korisnik.getEmail())) {
            throw new RuntimeException("Email već postoji!");
        }

        // Validacija obaveznih polja
        if (korisnik.getIme() == null || korisnik.getIme().isBlank()) {
            throw new RuntimeException("Ime je obavezno!");
        }
        if (korisnik.getPrezime() == null || korisnik.getPrezime().isBlank()) {
            throw new RuntimeException("Prezime je obavezno!");
        }
        if (korisnik.getLozinkaHash() == null || korisnik.getLozinkaHash().length() < 6) {
            throw new RuntimeException("Lozinka mora imati najmanje 6 karaktera!");
        }

        korisnik.setLozinkaHash(passwordEncoder.encode(korisnik.getLozinkaHash()));
        korisnik.setDatumRegistracije(LocalDateTime.now());
        korisnik.setStatusNaloga(StatusNaloga.na_cekanju);
        korisnik.setVerifikovan(false);

        Korisnik sacuvan = korisnikRepository.save(korisnik);

        // Auto-create volonter_info row so services can be added later
        if (TipKorisnika.volonter.equals(sacuvan.getTipKorisnika())) {
            VolonterInfo info = new VolonterInfo();
            info.setKorisnik(sacuvan);
            info.setBiografija(korisnik.getOpis() != null ? korisnik.getOpis() : "");
            info.setPortfolioLink(korisnik.getPortfolioLinkTemp() != null ? korisnik.getPortfolioLinkTemp() : "");
            info.setCvUrl(korisnik.getCvUrlTemp() != null ? korisnik.getCvUrlTemp() : "");
            info.setBrojUsluga(0);
            volonterInfoRepository.save(info);
        }

        // Email potvrda registracije (SRS 3.4.2)
        emailService.posaljiPotvrduRegistracije(sacuvan.getEmail(), sacuvan.getIme());

        return sacuvan;
    }

    // Kupac je odmah aktivan — ne čeka verifikaciju (SRS 6.1)
    public Korisnik registrujKupca(Korisnik korisnik) {
        korisnik.setTipKorisnika(TipKorisnika.kupac);
        // registrujKorisnika sets na_cekanju/false as defaults, so override them after
        Korisnik sacuvan = registrujKorisnika(korisnik);
        sacuvan.setVerifikovan(true);
        sacuvan.setStatusNaloga(StatusNaloga.aktivan);
        return korisnikRepository.save(sacuvan);
    }

    // Prvi admin — odmah aktivan. Radi samo ako nijedan admin ne postoji još.
    public Korisnik registrujPrvogAdmina(Korisnik korisnik) {
        if (!korisnikRepository.findByTipKorisnika(TipKorisnika.administrator).isEmpty()) {
            throw new RuntimeException("Administrator već postoji. Novi admin mora biti odobren od strane postojećeg administratora.");
        }
        korisnik.setTipKorisnika(TipKorisnika.administrator);
        Korisnik sacuvan = registrujKorisnika(korisnik);
        sacuvan.setVerifikovan(true);
        sacuvan.setStatusNaloga(StatusNaloga.aktivan);
        return korisnikRepository.save(sacuvan);
    }

    // ===================== LOGIN =====================

    public Korisnik login(String email, String lozinka, String ipAdresa) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, lozinka)
            );
            Korisnik korisnik = (Korisnik) auth.getPrincipal();
            logService.logLogin(korisnik, ipAdresa);
            return korisnik;

        } catch (BadCredentialsException e) {
            logService.logNeuspioPrijava(email, ipAdresa);
            throw new RuntimeException("Pogrešan email ili lozinka.");
        } catch (DisabledException e) {
            logService.logNeuspioPrijava(email, ipAdresa);
            throw new RuntimeException("Nalog nije verifikovan. Sačekajte odobrenje administratora.");
        }
    }

    public void logout(int korisnikId, String ipAdresa) {
        korisnikRepository.findById(korisnikId).ifPresent(k ->
                logService.logLogout(k, ipAdresa));
    }

    // ===================== ČITANJE =====================

    public boolean emailPostoji(String email) { return korisnikRepository.existsByEmail(email); }

    public List<Korisnik> getAllKorisnici() { return korisnikRepository.findAll(); }

    public Optional<Korisnik> getKorisnikById(int id) { return korisnikRepository.findById(id); }

    public List<Korisnik> getByTip(TipKorisnika tip) { return korisnikRepository.findByTipKorisnika(tip); }

    public List<Korisnik> getByStatus(StatusNaloga status) { return korisnikRepository.findByStatusNaloga(status); }

    // ===================== ADMIN — PROMJENA STATUSA (SRS 5.3 / 5.3.1) =====================

    public Korisnik promijeniStatus(int id, StatusNaloga noviStatus, String razlog) {
        if (razlog == null || razlog.isBlank()) {
            throw new RuntimeException("Razlog promjene statusa je obavezan!");
        }

        Korisnik k = korisnikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik ne postoji"));

        // Jednom uklonjen — nema povratka (SRS 3.8)
        if (k.getStatusNaloga() == StatusNaloga.uklonjen) {
            throw new RuntimeException("Uklonjen korisnik ne može promijeniti status.");
        }

        k.setStatusNaloga(noviStatus);
        k.setRazlogPromjeneStatusa(razlog);

        if (noviStatus == StatusNaloga.uklonjen) {
            k.setVerifikovan(false);
        }

        // Ako admin odobri — postavi kao verifikovan i aktivan
        if (noviStatus == StatusNaloga.aktivan && !k.isVerifikovan()) {
            k.setVerifikovan(true);
            emailService.posaljiOdobrenjeNaloga(k.getEmail(), k.getIme());
        } else {
            // Za svaku drugu promjenu statusa — pošalji obavještenje (SRS 5.3.1)
            emailService.posaljiPromjenuStatusa(k.getEmail(), k.getIme(),
                    noviStatus.name(), razlog);
        }

        return korisnikRepository.save(k);
    }

    // ===================== BRISANJE =====================

    public void obrisiKorisnika(int id) { korisnikRepository.deleteById(id); }
}
