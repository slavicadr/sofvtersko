package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.repositories.VolonterInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VolonterInfoService {

    private final VolonterInfoRepository repository;
    private final KorisnikRepository korisnikRepository;

    public VolonterInfoService(VolonterInfoRepository repository,
                               KorisnikRepository korisnikRepository) {
        this.repository = repository;
        this.korisnikRepository = korisnikRepository;
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

        return Map.of(
                "volonterId", volonterId,
                "ime", volonter.getIme(),
                "prezime", volonter.getPrezime(),
                "email", volonter.getEmail(),
                "statusNaloga", volonter.getStatusNaloga(),
                "biografija", info.getBiografija() != null ? info.getBiografija() : "",
                "portfolioLink", info.getPortfolioLink() != null ? info.getPortfolioLink() : "",
                "brojRealizovanihUsluga", info.getBrojUsluga()
        );
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

    public void obrisi(int id) { repository.deleteById(id); }
}
