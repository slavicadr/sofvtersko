package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.OcjenaRecenzija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.repositories.OcjenaRecenzijaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

    @Service
    public class OcjenaRecenzijaService {

        private final OcjenaRecenzijaRepository repository;

        public OcjenaRecenzijaService(OcjenaRecenzijaRepository repository) {
            this.repository = repository;
        }

        public OcjenaRecenzija dodajRecenziju(KupljenaUsluga kupovina,
                                              Korisnik ocjenjivac,
                                              int brojZvjezdica,
                                              String komentar) {

            if (repository.findByKupovina(kupovina).isPresent()) {
                throw new RuntimeException("Recenzija za ovu kupovinu već postoji!");
            }

            OcjenaRecenzija ocjena = new OcjenaRecenzija();
            ocjena.setKupovina(kupovina);
            ocjena.setOcjenjivac(ocjenjivac);
            ocjena.setBrojZvjezdica(brojZvjezdica);
            ocjena.setKomentar(komentar);
            ocjena.setDatumOcjene(LocalDateTime.now());

            return repository.save(ocjena);
        }

        public List<OcjenaRecenzija> getAll() {
            return repository.findAll();
        }

        public List<OcjenaRecenzija> getByKorisnik(Korisnik korisnik) {
            return repository.findByOcjenjivac(korisnik);
        }

        public List<OcjenaRecenzija> getByOcjena(int brojZvjezdica) {
            return repository.findByBrojZvjezdica(brojZvjezdica);
        }

        public void obrisi(int id) {
            repository.deleteById(id);
        }
    }

