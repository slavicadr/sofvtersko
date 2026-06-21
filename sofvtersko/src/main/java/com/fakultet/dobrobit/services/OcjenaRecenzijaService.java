package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.OcjenaRecenzija;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.repositories.KupljenaUslugaRepository;
import com.fakultet.dobrobit.repositories.OcjenaRecenzijaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcjenaRecenzijaService {

    private final OcjenaRecenzijaRepository repository;
    private final KupljenaUslugaRepository kupljenaUslugaRepository;
    private final KorisnikRepository korisnikRepository;
    private final EmailService emailService;

    public OcjenaRecenzijaService(OcjenaRecenzijaRepository repository,
                                  KupljenaUslugaRepository kupljenaUslugaRepository,
                                  KorisnikRepository korisnikRepository,
                                  EmailService emailService) {
        this.repository = repository;
        this.kupljenaUslugaRepository = kupljenaUslugaRepository;
        this.korisnikRepository = korisnikRepository;
        this.emailService = emailService;
    }

    // Dodaje recenziju — kupac ili volonter te kupovine
    public OcjenaRecenzija dodajRecenziju(int kupovinaId, int ocjenjivacId, int brojZvjezdica, String komentar) {

        KupljenaUsluga kupovina = kupljenaUslugaRepository.findById(kupovinaId)
                .orElseThrow(() -> new RuntimeException("Kupovina sa ID " + kupovinaId + " ne postoji!"));

        Korisnik ocjenjivac = korisnikRepository.findById(ocjenjivacId)
                .orElseThrow(() -> new RuntimeException("Korisnik ne postoji!"));

        int kupacId = kupovina.getDonator().getKorisnikId();
        int volonterId = kupovina.getUslugaProizvod().getVolonter().getKorisnikId();

        if (ocjenjivacId != kupacId && ocjenjivacId != volonterId) {
            throw new RuntimeException("Samo kupac ili volonter te kupovine mogu ostaviti recenziju!");
        }
        if (ocjenjivacId == volonterId && ocjenjivacId == kupacId) {
            throw new RuntimeException("Ne možete ostaviti recenziju za vlastitu uslugu!");
        }

        if (repository.findByKupovinaAndOcjenjivac(kupovina, ocjenjivac).isPresent()) {
            throw new RuntimeException("Već ste ostavili recenziju za ovu kupovinu!");
        }

        if (brojZvjezdica < 1 || brojZvjezdica > 5) {
            throw new RuntimeException("Ocjena mora biti između 1 i 5!");
        }

        OcjenaRecenzija ocjena = new OcjenaRecenzija();
        ocjena.setKupovina(kupovina);
        ocjena.setOcjenjivac(ocjenjivac);
        ocjena.setBrojZvjezdica(brojZvjezdica);
        ocjena.setKomentar(komentar);
        ocjena.setDatumOcjene(LocalDateTime.now());

        OcjenaRecenzija sacuvana = repository.save(ocjena);

        // Email volonteru samo kad kupac ostavi recenziju (ne kad volonter recenzira kupca)
        if (ocjenjivacId == kupacId) {
            Korisnik volonterK = kupovina.getUslugaProizvod().getVolonter();
            emailService.posaljiObavjestenjeRecenzije(
                    volonterK.getEmail(),
                    volonterK.getIme() + " " + volonterK.getPrezime(),
                    ocjenjivac.getIme() + " " + ocjenjivac.getPrezime(),
                    kupovina.getUslugaProizvod().getNaziv(),
                    brojZvjezdica,
                    komentar
            );
        }

        return sacuvana;
    }

    // Volonter odgovara na recenziju kupca — šalje email kupcu
    public OcjenaRecenzija dodajOdgovor(int ocjenaId, int volonterId, String odgovor) {
        OcjenaRecenzija ocjena = repository.findById(ocjenaId)
                .orElseThrow(() -> new RuntimeException("Recenzija ne postoji!"));

        int vlasnikId = ocjena.getKupovina().getUslugaProizvod().getVolonter().getKorisnikId();
        if (vlasnikId != volonterId) {
            throw new RuntimeException("Nemate pravo odgovoriti na ovu recenziju!");
        }
        if (ocjena.getOdgovorVolontera() != null) {
            throw new RuntimeException("Već ste odgovorili na ovu recenziju!");
        }

        ocjena.setOdgovorVolontera(odgovor);
        ocjena.setDatumOdgovora(LocalDateTime.now());
        OcjenaRecenzija sacuvana = repository.save(ocjena);

        Korisnik kupac = ocjena.getKupovina().getDonator();
        Korisnik volonterK = ocjena.getKupovina().getUslugaProizvod().getVolonter();
        emailService.posaljiOdgovorNaRecenziju(
                kupac.getEmail(),
                kupac.getIme() + " " + kupac.getPrezime(),
                volonterK.getIme() + " " + volonterK.getPrezime(),
                ocjena.getKupovina().getUslugaProizvod().getNaziv(),
                odgovor
        );

        return sacuvana;
    }

    public List<OcjenaRecenzija> getAll() { return repository.findAll(); }

    // Recenzije po uslugaProizvodId — za prikaz na profilu volontera
    public List<OcjenaRecenzija> getByUsluga(int uslugaId) {
        return repository.findByKupovina_UslugaProizvod_UslugaProizvodId(uslugaId);
    }

    // Recenzije koje je ostavio određeni kupac (SRS 6.3)
    public List<OcjenaRecenzija> getByKupac(int kupacId) {
        return repository.findByOcjenjivac_KorisnikId(kupacId);
    }

    // Prosječna ocjena za volontera — samo recenzije od kupaca, ne volonterove vlastite
    public double getProsjecnaOcjena(int volonterId) {
        List<OcjenaRecenzija> recenzije = repository
                .findByKupovina_UslugaProizvod_Volonter_KorisnikIdAndOcjenjivac_KorisnikIdNot(volonterId, volonterId);
        return recenzije.stream()
                .mapToInt(OcjenaRecenzija::getBrojZvjezdica)
                .average()
                .orElse(0.0);
    }

    // Recenzije od kupaca za volonterove usluge (za volonter dashboard)
    public List<OcjenaRecenzija> getByVolonter(int volonterId) {
        return repository
                .findByKupovina_UslugaProizvod_Volonter_KorisnikIdAndOcjenjivac_KorisnikIdNot(volonterId, volonterId);
    }

    // Brisanje neprimjerenih recenzija — samo admin (SRS 5.3)
    public void obrisi(int id) { repository.deleteById(id); }
}
