package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.repositories.KorisnikPomociRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KorisnikPomociService {

    private final KorisnikPomociRepository korisnikPomociRepository;

    public KorisnikPomociService(KorisnikPomociRepository korisnikPomociRepository) {
        this.korisnikPomociRepository = korisnikPomociRepository;
    }

    public KorisnikPomoci kreiraj(KorisnikPomoci kp) {

        if (korisnikPomociRepository.findByKorisnik(kp.getKorisnik()).isPresent()) {
            throw new RuntimeException("Korisnik već ima zahtjev za pomoć!");
        }

        return korisnikPomociRepository.save(kp);
    }

    public List<KorisnikPomoci> getAll() {
        return korisnikPomociRepository.findAll();
    }

    public KorisnikPomoci getById(int id) {
        return korisnikPomociRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik pomoći ne postoji"));
    }

    public KorisnikPomoci getByKorisnik(Korisnik korisnik) {
        return korisnikPomociRepository.findByKorisnik(korisnik)
                .orElseThrow(() -> new RuntimeException("Zahtjev ne postoji"));
    }

    public List<KorisnikPomoci> pretrazi(String naziv) {
        return korisnikPomociRepository.findByNazivContainingIgnoreCase(naziv);
    }

    public KorisnikPomoci update(int id, KorisnikPomoci noviPodaci) {

        KorisnikPomoci postojeci = getById(id);

        postojeci.setNaziv(noviPodaci.getNaziv());
        postojeci.setOpisPotrebe(noviPodaci.getOpisPotrebe());
        postojeci.setBrojRacuna(noviPodaci.getBrojRacuna());
        postojeci.setDokazVerifikacije(noviPodaci.getDokazVerifikacije());

        return korisnikPomociRepository.save(postojeci);
    }

    public void obrisi(int id) {

        if (!korisnikPomociRepository.existsById(id)) {
            throw new RuntimeException("Korisnik pomoći ne postoji");
        }

        korisnikPomociRepository.deleteById(id);
    }
}