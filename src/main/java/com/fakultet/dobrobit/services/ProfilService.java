package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Profil;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.repositories.ProfilRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;

    @Service
    public class ProfilService {

        private final ProfilRepository repository;

        public ProfilService(ProfilRepository repository) {
            this.repository = repository;
        }

        public Profil kreirajProfil(Profil profil) {

            if (repository.findByKorisnik(profil.getKorisnik()).isPresent()) {
                throw new RuntimeException("Profil već postoji!");
            }

            return repository.save(profil);
        }

        public List<Profil> getAll() {
            return repository.findAll();
        }

        public Profil getByKorisnik(Korisnik korisnik) {
            return repository.findByKorisnik(korisnik)
                    .orElseThrow(() -> new RuntimeException("Profil ne postoji"));
        }

/*        public List<Profil> getByGrad(String grad) {
            return repository.findByGradContainingIgnoreCase(grad);
        }
*/
        public List<Profil> getNajbolji(BigDecimal ocjena) {
            return repository.findByProsjecnaOcjenaGreaterThanEqual(ocjena);
        }

        public void obrisi(int id) {
            repository.deleteById(id);
        }
    }

