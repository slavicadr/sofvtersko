package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.repositories.OcjenaRecenzijaRepository;
import com.fakultet.dobrobit.repositories.VolonterInfoRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VolonterInfoService {

    private final VolonterInfoRepository repository;
    private final KorisnikRepository korisnikRepository;
    private final OcjenaRecenzijaRepository ocjenaRepository;

    public VolonterInfoService(VolonterInfoRepository repository,
                               KorisnikRepository korisnikRepository,
                               OcjenaRecenzijaRepository ocjenaRepository) {
        this.repository = repository;
        this.korisnikRepository = korisnikRepository;
        this.ocjenaRepository = ocjenaRepository;
    }

    // Kreira VolonterInfo za volontera (vezan za Korisnik)
    public VolonterInfo kreiraj(int volonterId, String biografija, String portfolioLink) {
        Korisnik volonter = korisnikRepository.findById(volonterId)
                .orElseThrow(() -> new RuntimeException("Korisnik sa ID " + volonterId + " ne postoji!"));

        if (repository.findByKorisnik(volonter).isPresent()) {
            throw new RuntimeException("Volonter profil već postoji!");
        }

        VolonterInfo info = new VolonterInfo();
        info.setKorisnik(volonter);
        info.setBiografija(biografija);
        info.setPortfolioLink(portfolioLink);
        info.setBrojUsluga(0);

        return repository.save(info);
    }

    public List<VolonterInfo> getAll() { return repository.findAll(); }

    // Dashboard volontera — vraća sve info sa prosječnom ocjenom (SRS 3.1)
    public Map<String, Object> getDashboard(int volonterId) {
        Korisnik volonter = korisnikRepository.findById(volonterId)
                .orElseThrow(() -> new RuntimeException("Volonter ne postoji!"));

        VolonterInfo info = repository.findByKorisnik(volonter)
                .orElseThrow(() -> new RuntimeException("Volonter profil ne postoji!"));

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("volonterId", volonterId);
        result.put("ime", volonter.getIme());
        result.put("prezime", volonter.getPrezime());
        result.put("email", volonter.getEmail());
        result.put("statusNaloga", volonter.getStatusNaloga());
        result.put("biografija", info.getBiografija() != null ? info.getBiografija() : "");
        result.put("portfolioLink", info.getPortfolioLink() != null ? info.getPortfolioLink() : "");
        result.put("cvUrl", info.getCvUrl() != null ? info.getCvUrl() : "");
        result.put("brojRealizovanihUsluga", info.getBrojUsluga());
        return result;
    }

    // Ažurira broj realizovanih usluga — poziva se nakon kupovine
    public void uvecajBrojUsluga(int volonterId) {
        Korisnik volonter = korisnikRepository.findById(volonterId)
                .orElseThrow(() -> new RuntimeException("Volonter ne postoji!"));

        VolonterInfo info = repository.findByKorisnik(volonter)
                .orElseThrow(() -> new RuntimeException("Volonter profil ne postoji!"));

        info.setBrojUsluga(info.getBrojUsluga() + 1);
        repository.save(info);
    }

    // Ažuriranje biografije i portfolio linka
    public VolonterInfo azuriraj(int volonterId, String biografija, String portfolioLink) {
        Korisnik volonter = korisnikRepository.findById(volonterId)
                .orElseThrow(() -> new RuntimeException("Volonter ne postoji!"));

        VolonterInfo info = repository.findByKorisnik(volonter)
                .orElseThrow(() -> new RuntimeException("Volonter profil ne postoji!"));

        if (biografija != null) info.setBiografija(biografija);
        if (portfolioLink != null) info.setPortfolioLink(portfolioLink);

        return repository.save(info);
    }

    public List<VolonterInfo> aktivni() {
        return repository.findByBrojUslugaGreaterThan(0);
    }

    // Top N volontera sortirani po kombinaciji prosječne ocjene i broja realizovanih usluga
    public List<Map<String, Object>> istaknuti(int limit) {
        return repository.findAll().stream()
            .map(info -> {
                int vid = info.getKorisnik().getKorisnikId();
                double avg = ocjenaRepository
                        .findByKupovina_UslugaProizvod_Volonter_KorisnikId(vid)
                        .stream()
                        .mapToInt(r -> r.getBrojZvjezdica())
                        .average()
                        .orElse(0.0);
                double score = avg * 2.0 + info.getBrojUsluga() * 0.5;

                Map<String, Object> m = new java.util.LinkedHashMap<>();
                m.put("volonterId", vid);
                m.put("ime", info.getKorisnik().getIme());
                m.put("prezime", info.getKorisnik().getPrezime());
                m.put("opis", info.getKorisnik().getOpis() != null ? info.getKorisnik().getOpis() : "");
                m.put("brojUsluga", info.getBrojUsluga());
                m.put("avgRating", Math.round(avg * 10.0) / 10.0);
                m.put("score", score);
                return m;
            })
            .sorted(Comparator.comparingDouble((Map<String, Object> m) -> (Double) m.get("score")).reversed())
            .limit(limit)
            .collect(Collectors.toList());
    }

    public void obrisi(int id) { repository.deleteById(id); }
}
