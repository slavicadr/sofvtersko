package com.fakultet.dobrobit.services;
import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.repositories.KupljenaUslugaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KupljenaUslugaService {

    private final KupljenaUslugaRepository repository;

    public KupljenaUslugaService(KupljenaUslugaRepository repository) {
        this.repository = repository;
    }

    public KupljenaUsluga kupiUslugu(Korisnik donator,
                                     UslugaProizvod usluga,
                                     KorisnikPomoci pomoc,
                                     java.math.BigDecimal iznos,
                                     String nacinPlacanja) {

        if (donator == null || usluga == null || pomoc == null) {
            throw new RuntimeException("Podaci za kupovinu nisu validni!");
        }

        KupljenaUsluga kupovina = new KupljenaUsluga();
        kupovina.setDonator(donator);
        kupovina.setUslugaProizvod(usluga);
        kupovina.setKorisnikPomoci(pomoc);
        kupovina.setIznos(iznos);

        kupovina.setDatumKupovine(LocalDateTime.now());
        kupovina.setStatusPlacanja("neplaceno");
        kupovina.setNacinPlacanja(nacinPlacanja);

        return repository.save(kupovina);
    }

    public List<KupljenaUsluga> getAll() {
        return repository.findAll();
    }

    public KupljenaUsluga getById(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kupovina ne postoji"));
    }

    public List<KupljenaUsluga> getByDonator(Korisnik donator) {
        return repository.findByDonator(donator);
    }

/*    public List<KupljenaUsluga> getByUsluga(UslugaProizvod usluga) {
        return repository.findByUslugaProizvod(usluga);
    }
*/
    public List<KupljenaUsluga> getByPomoc(KorisnikPomoci pomoc) {
        return repository.findByKorisnikPomoci(pomoc);
    }

    public KupljenaUsluga promijeniStatus(int id, String status) {
        KupljenaUsluga kupovina = getById(id);

        kupovina.setStatusPlacanja(status);
        return repository.save(kupovina);
    }

    public void obrisi(int id) {
        repository.deleteById(id);
    }
}