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
    private final VolonterInfoService volonterInfoService;

    public KupljenaUslugaService(KupljenaUslugaRepository repository,
                                 KorisnikRepository korisnikRepository,
                                 UslugaProizvodRepository uslugaRepository,
                                 KorisnikPomociRepository pomocRepository,
                                 VolonterInfoService volonterInfoService) {
        this.repository = repository;
        this.korisnikRepository = korisnikRepository;
        this.uslugaRepository = uslugaRepository;
        this.pomocRepository = pomocRepository;
        this.volonterInfoService = volonterInfoService;
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
        kupovina.setIznos(iznos != null ? iznos : usluga.getCijena());
        kupovina.setDatumKupovine(LocalDateTime.now());
        kupovina.setStatusPlacanja("placeno");
        kupovina.setNacinPlacanja(nacinPlacanja);

        KupljenaUsluga sacuvana = repository.save(kupovina);

        // Auto-disable service when capacity limit is reached
        if (usluga.getKapacitet() != null && usluga.getKapacitet() > 0) {
            long ukupnoKupovina = repository.countByUslugaProizvod(usluga);
            if (ukupnoKupovina >= usluga.getKapacitet()) {
                usluga.setStatusObjave("popunjeno");
                uslugaRepository.save(usluga);
            }
        }

        return sacuvana;
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

    public KupljenaUsluga oznaciRealizovano(int kupovinaId, int requesterId, String requesterRole) {
        KupljenaUsluga k = getById(kupovinaId);

        if ("realizovano".equals(k.getStatusIsporuke())) {
            throw new RuntimeException("Usluga je već označena kao realizovana.");
        }

        int buyerId = k.getDonator().getKorisnikId();
        int volonterId = k.getUslugaProizvod().getVolonter().getKorisnikId();
        boolean isAdmin = "administrator".equals(requesterRole);
        boolean isBuyer = requesterId == buyerId;
        boolean isVolonter = requesterId == volonterId;

        if (!isAdmin && !isBuyer && !isVolonter) {
            throw new RuntimeException("Nemate pravo da označite ovu uslugu kao realizovanu.");
        }

        k.setStatusIsporuke("realizovano");
        k.setDatumRealizacije(LocalDateTime.now());
        KupljenaUsluga saved = repository.save(k);

        volonterInfoService.uvecajBrojUsluga(volonterId);

        return saved;
    }

    public List<KupljenaUsluga> getByVolonter(int volonterId) {
        Korisnik volonter = korisnikRepository.findById(volonterId)
                .orElseThrow(() -> new RuntimeException("Volonter ne postoji"));
        return repository.findByUslugaProizvod_Volonter(volonter);
    }
}
