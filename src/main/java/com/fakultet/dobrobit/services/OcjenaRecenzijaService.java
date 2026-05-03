package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.OcjenaRecenzija;
import com.fakultet.dobrobit.repositories.KupljenaUslugaRepository;
import com.fakultet.dobrobit.repositories.OcjenaRecenzijaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OcjenaRecenzijaService {

    private final OcjenaRecenzijaRepository repository;
    private final KupljenaUslugaRepository kupljenaUslugaRepository;

    public OcjenaRecenzijaService(OcjenaRecenzijaRepository repository,
                                  KupljenaUslugaRepository kupljenaUslugaRepository) {
        this.repository = repository;
        this.kupljenaUslugaRepository = kupljenaUslugaRepository;
    }

    // Dodaje recenziju (SRS UC-6, 11.1, 11.2)
    public OcjenaRecenzija dodajRecenziju(int kupovinaId, int kupacId, int brojZvjezdica, String komentar) {

        KupljenaUsluga kupovina = kupljenaUslugaRepository.findById(kupovinaId)
                .orElseThrow(() -> new RuntimeException("Kupovina sa ID " + kupovinaId + " ne postoji!"));

        // Provjera: samo kupac te kupovine može ostaviti recenziju (SRS 6.3)
        if (kupovina.getDonator().getKorisnikId() != kupacId) {
            throw new RuntimeException("Samo kupac koji je platio uslugu može ostaviti recenziju!");
        }

        // Provjera: jedna recenzija po kupovini (SRS 11.2)
        if (repository.findByKupovina(kupovina).isPresent()) {
            throw new RuntimeException("Recenzija za ovu kupovinu već postoji!");
        }

        // Provjera: ocjena 1-5 (SRS 11.1)
        if (brojZvjezdica < 1 || brojZvjezdica > 5) {
            throw new RuntimeException("Ocjena mora biti između 1 i 5!");
        }

        OcjenaRecenzija ocjena = new OcjenaRecenzija();
        ocjena.setKupovina(kupovina);
        ocjena.setOcjenjivac(kupovina.getDonator());
        ocjena.setBrojZvjezdica(brojZvjezdica);
        ocjena.setKomentar(komentar);
        ocjena.setDatumOcjene(LocalDateTime.now());

        return repository.save(ocjena);
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

    // Prosječna ocjena za volontera
    public double getProsjecnaOcjena(int volonterId) {
        List<OcjenaRecenzija> recenzije = repository.findByKupovina_UslugaProizvod_Volonter_KorisnikId(volonterId);
        return recenzije.stream()
                .mapToInt(OcjenaRecenzija::getBrojZvjezdica)
                .average()
                .orElse(0.0);
    }

    // Brisanje neprimjerenih recenzija — samo admin (SRS 5.3)
    public void obrisi(int id) { repository.deleteById(id); }
}
