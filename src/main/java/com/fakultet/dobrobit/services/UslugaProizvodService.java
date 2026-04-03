package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.Kategorija;
import com.fakultet.dobrobit.repositories.UslugaProizvodRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
    public class UslugaProizvodService {

        private final UslugaProizvodRepository repository;

        public UslugaProizvodService(UslugaProizvodRepository repository) {
            this.repository = repository;
        }

        public UslugaProizvod kreiraj(UslugaProizvod usluga) {

            usluga.setDatumKreiranja(LocalDateTime.now());
            usluga.setStatusObjave("na_cekanju");

            return repository.save(usluga);
        }

        public List<UslugaProizvod> getAll() {
            return repository.findAll();
        }

        public List<UslugaProizvod> getByVolonter(Korisnik volonter) {
            return repository.findByVolonter(volonter);
        }

        public List<UslugaProizvod> getByKategorija(Kategorija kategorija) {
            return repository.findByKategorija(kategorija);
        }

        public List<UslugaProizvod> pretrazi(String naziv) {
            return repository.findByNazivContainingIgnoreCase(naziv);
        }

        public UslugaProizvod promijeniStatus(int id, String status) {
            UslugaProizvod u = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usluga ne postoji"));

            u.setStatusObjave(status);
            return repository.save(u);
        }

        public void obrisi(int id) {
            repository.deleteById(id);
        }
    }

