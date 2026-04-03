package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.repositories.VolonterInfoRepository;

import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class VolonterInfoService {

        private final VolonterInfoRepository repository;

        public VolonterInfoService(VolonterInfoRepository repository) {
            this.repository = repository;
        }

        public VolonterInfo kreiraj(VolonterInfo v) {

            if (repository.findByKorisnik(v.getKorisnik()).isPresent()) {
                throw new RuntimeException("Volonter profil već postoji!");
            }

            return repository.save(v);
        }

        public List<VolonterInfo> getAll() {
            return repository.findAll();
        }

        public VolonterInfo getByKorisnik(Korisnik korisnik) {
            return repository.findByKorisnik(korisnik)
                    .orElseThrow(() -> new RuntimeException("Ne postoji profil volontera"));
        }

        public List<VolonterInfo> aktivni() {
            return repository.findByBrojUslugaGreaterThan(0);
        }

        public void obrisi(int id) {
            repository.deleteById(id);
        }
    }

