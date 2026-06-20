package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.repositories.DonacijaRepository;
import com.fakultet.dobrobit.repositories.KorisnikPomociRepository;
import com.fakultet.dobrobit.repositories.KupljenaUslugaRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KorisnikPomociService {

    private final KorisnikPomociRepository korisnikPomociRepository;
    private final DonacijaRepository donacijaRepository;
    private final KupljenaUslugaRepository kupljenaUslugaRepository;

    public KorisnikPomociService(KorisnikPomociRepository korisnikPomociRepository,
                                  DonacijaRepository donacijaRepository,
                                  KupljenaUslugaRepository kupljenaUslugaRepository) {
        this.korisnikPomociRepository = korisnikPomociRepository;
        this.donacijaRepository = donacijaRepository;
        this.kupljenaUslugaRepository = kupljenaUslugaRepository;
    }

    public KorisnikPomoci kreiraj(KorisnikPomoci kp) {
        if (kp.getKorisnik() != null && korisnikPomociRepository.findByKorisnik(kp.getKorisnik()).isPresent()) {
            throw new RuntimeException("Korisnik već ima zahtjev za pomoć!");
        }
        return korisnikPomociRepository.save(kp);
    }

    public KorisnikPomoci kreirajAdminSlucaj(String naziv, String opisPotrebe) {
        KorisnikPomoci kp = new KorisnikPomoci();
        kp.setNaziv(naziv);
        kp.setOpisPotrebe(opisPotrebe);
        kp.setBrojRacuna("");
        return korisnikPomociRepository.save(kp);
    }

    public List<KorisnikPomoci> getAll() {
        return korisnikPomociRepository.findAll();
    }

    public List<KorisnikPomoci> getAktivni() {
        return korisnikPomociRepository.findByStatusSlucaja("aktivan");
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
        if (noviPodaci.getStatusSlucaja() != null)
            postojeci.setStatusSlucaja(noviPodaci.getStatusSlucaja());

        return korisnikPomociRepository.save(postojeci);
    }

    public void obrisi(int id) {
        if (!korisnikPomociRepository.existsById(id))
            throw new RuntimeException("Korisnik pomoći ne postoji");
        korisnikPomociRepository.deleteById(id);
    }
}