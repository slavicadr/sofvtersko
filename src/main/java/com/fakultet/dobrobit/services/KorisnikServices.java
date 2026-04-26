package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import org.springframework.security.authentication.AuthenticationManager;
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

    public KorisnikServices(KorisnikRepository korisnikRepository,
                            PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager) {
        this.korisnikRepository = korisnikRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    // ===================== REGISTRACIJA =====================

    public Korisnik registrujKorisnika(Korisnik korisnik) {
        if (korisnikRepository.existsByEmail(korisnik.getEmail())) {
            throw new RuntimeException("Email već postoji!");
        }

        // Hesiramo lozinku prije snimanja u bazu
        korisnik.setLozinkaHash(passwordEncoder.encode(korisnik.getLozinkaHash()));
        korisnik.setDatumRegistracije(LocalDateTime.now());
        korisnik.setStatusNaloga(StatusNaloga.na_cekanju);
        korisnik.setVerifikovan(false);

        return korisnikRepository.save(korisnik);
    }

    // Posebna metoda za registraciju kupca — može biti anoniman (SRS 6.1)
    public Korisnik registrujKupca(Korisnik korisnik) {
        korisnik.setTipKorisnika(TipKorisnika.kupac);
        // Kupac je odmah verifikovan i aktivan (ne mora čekati admina)
        korisnik.setVerifikovan(true);
        korisnik.setStatusNaloga(StatusNaloga.aktivan);
        return registrujKorisnika(korisnik);
    }

    // ===================== LOGIN =====================

    // Koristimo Spring Security AuthenticationManager — on sam provjerava hash
    public Korisnik login(String email, String lozinka) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, lozinka)
        );
        // Ako autentifikacija ne uspije, Spring baca AuthenticationException automatski
        return (Korisnik) auth.getPrincipal();
    }

    // ===================== ČITANJE =====================

    public List<Korisnik> getAllKorisnici() {
        return korisnikRepository.findAll();
    }

    public Optional<Korisnik> getKorisnikById(int id) {
        return korisnikRepository.findById(id);
    }

    public List<Korisnik> getByTip(TipKorisnika tip) {
        return korisnikRepository.findByTipKorisnika(tip);
    }

    public List<Korisnik> getByStatus(StatusNaloga status) {
        return korisnikRepository.findByStatusNaloga(status);
    }

    // ===================== ADMIN — PROMJENA STATUSA (SRS 5.3 / 5.3.1) =====================

    public Korisnik promijeniStatus(int id, StatusNaloga noviStatus, String razlog) {
        Korisnik k = korisnikRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik ne postoji"));

        // Jednom uklonjen volonter nema mogućnost povratka (SRS 3.8)
        if (k.getStatusNaloga() == StatusNaloga.uklonjen) {
            throw new RuntimeException("Uklonjen korisnik ne može promijeniti status.");
        }

        k.setStatusNaloga(noviStatus);
        k.setRazlogPromjeneStatusa(razlog);

        // Uklonjen korisnik gubi verifikaciju
        if (noviStatus == StatusNaloga.uklonjen) {
            k.setVerifikovan(false);
        }

        return korisnikRepository.save(k);
    }

    // ===================== BRISANJE =====================

    public void obrisiKorisnika(int id) {
        korisnikRepository.deleteById(id);
    }
}
