package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.*;
import com.fakultet.dobrobit.repositories.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class KupljenaUslugaService {

    private final KupljenaUslugaRepository repository;
    private final KorisnikRepository korisnikRepository;
    private final UslugaProizvodRepository uslugaRepository;
    private final KorisnikPomociRepository pomocRepository;

    public KupljenaUslugaService(KupljenaUslugaRepository repository,
                                 KorisnikRepository korisnikRepository,
                                 UslugaProizvodRepository uslugaRepository,
                                 KorisnikPomociRepository pomocRepository) {
        this.repository = repository;
        this.korisnikRepository = korisnikRepository;
        this.uslugaRepository = uslugaRepository;
        this.pomocRepository = pomocRepository;
    }

    // Prima ID-jeve, sam učitava entitete iz baze (SRS UC-3)
    public KupljenaUsluga kupiUslugu(int kupacId, int uslugaId, int pomocId,
                                     BigDecimal iznos, String nacinPlacanja) {

        Korisnik kupac = korisnikRepository.findById(kupacId)
                .orElseThrow(() -> new RuntimeException("Kupac sa ID " + kupacId + " ne postoji!"));

        UslugaProizvod usluga = uslugaRepository.findById(uslugaId)
                .orElseThrow(() -> new RuntimeException("Usluga sa ID " + uslugaId + " ne postoji!"));

        // Usluga mora biti aktivna (SRS 3.3)
        if (!"aktivna".equals(usluga.getStatusObjave())) {
            throw new RuntimeException("Usluga nije aktivna i ne može se kupiti!");
        }

        KorisnikPomoci pomoc = pomocRepository.findById(pomocId)
                .orElseThrow(() -> new RuntimeException("Korisnik pomoći sa ID " + pomocId + " ne postoji!"));

        KupljenaUsluga kupovina = new KupljenaUsluga();
        kupovina.setDonator(kupac);
        kupovina.setUslugaProizvod(usluga);
        kupovina.setKorisnikPomoci(pomoc);
        // Ako iznos nije proslijeđen, koristi cijenu usluge
        kupovina.setIznos(iznos != null ? iznos : usluga.getCijena());
        kupovina.setDatumKupovine(LocalDateTime.now());
        kupovina.setStatusPlacanja("placeno");
        kupovina.setNacinPlacanja(nacinPlacanja);

        return repository.save(kupovina);
    }

    public List<KupljenaUsluga> getAll() { return repository.findAll(); }

    public KupljenaUsluga getById(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kupovina ne postoji"));
    }

    public List<KupljenaUsluga> getByDonator(int kupacId) {
        Korisnik kupac = korisnikRepository.findById(kupacId)
                .orElseThrow(() -> new RuntimeException("Korisnik ne postoji"));
        return repository.findByDonator(kupac);
    }

    public List<KupljenaUsluga> getByPomoc(int pomocId) {
        KorisnikPomoci pomoc = pomocRepository.findById(pomocId)
                .orElseThrow(() -> new RuntimeException("Korisnik pomoći ne postoji"));
        return repository.findByKorisnikPomoci(pomoc);
    }

    public KupljenaUsluga promijeniStatus(int id, String status) {
        KupljenaUsluga k = getById(id);
        k.setStatusPlacanja(status);
        return repository.save(k);
    }
}
