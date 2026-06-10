package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Verifikacija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.repositories.VerifikacijaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
 @Service
    public class VerifikacijaService {

        private final VerifikacijaRepository repository;

        public VerifikacijaService(VerifikacijaRepository repository) {
            this.repository = repository;
        }

        public Verifikacija kreiraj(Verifikacija v) {

            v.setDatumVerifikacije(LocalDateTime.now());
            v.setStatus("na_cekanju");

            return repository.save(v);
        }

        public List<Verifikacija> getAll() {
            return repository.findAll();
        }

        public List<Verifikacija> getByKorisnik(Korisnik korisnik) {
            return repository.findByKorisnik(korisnik);
        }

        public List<Verifikacija> getByAdmin(Korisnik admin) {
            return repository.findByAdministrator(admin);
        }

        public List<Verifikacija> getByStatus(String status) {
            return repository.findByStatus(status);
        }

        public Verifikacija obradi(int id, String status, String napomena) {
            Verifikacija v = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Verifikacija ne postoji"));

            v.setStatus(status);
            v.setNapomena(napomena);

            return repository.save(v);
        }

        public void obrisi(int id) {
            repository.deleteById(id);
        }
    }

