package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.enums.StatusNaloga;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

    @Service
    public class KorisnikServices {

        private final KorisnikRepository korisnikRepository;

        public KorisnikServices(KorisnikRepository korisnikRepository) {
            this.korisnikRepository = korisnikRepository;
        }

        public Korisnik registrujKorisnika(Korisnik korisnik) {

            if (korisnikRepository.existsByEmail(korisnik.getEmail())) {
                throw new RuntimeException("Email već postoji!");
            }

            korisnik.setDatumRegistracije(LocalDateTime.now());
            korisnik.setStatusNaloga(StatusNaloga.na_cekanju);
            korisnik.setVerifikovan(false);

            // TODO: hash lozinke (kasnije)

            return korisnikRepository.save(korisnik);
        }

        public Optional<Korisnik> login(String email, String lozinkaHash) {
            Optional<Korisnik> korisnik = korisnikRepository.findByEmail(email);

            if (korisnik.isPresent() &&
                    korisnik.get().getLozinkaHash().equals(lozinkaHash)) {

                return korisnik;
            }

            return Optional.empty();
        }

        public List<Korisnik> getAllKorisnici() {
            return korisnikRepository.findAll();
        }

        public Optional<Korisnik> getKorisnikById(int id) {
            return korisnikRepository.findById(id);
        }

        public void obrisiKorisnika(int id) {
            korisnikRepository.deleteById(id);
        }
    }

