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

/*        public KorisnikPomoci kreirajZahtjev(KorisnikPomoci kp) {


            if (korisnikPomociRepository.findByKorisnik(kp.getKorisnik()).isPresent()) {
                throw new RuntimeException("Korisnik već ima zahtjev za pomoć!");
            }

            return korisnikPomociRepository.save(kp);
        }
*/

       /** public List<KorisnikPomoci> getAllZahtjevi() {
            return korisnikPomociRepository.findAll();
        }
*/
        public KorisnikPomoci getByKorisnik(Korisnik korisnik) {
            return korisnikPomociRepository.findByKorisnik(korisnik)
                    .orElseThrow(() -> new RuntimeException("Zahtjev ne postoji"));
        }

  /*      public List<KorisnikPomoci> pretrazi(String naziv) {
            return korisnikPomociRepository.findByNazivContainingIgnoreCase(naziv);
        }
*/
        // ✅ Brisanje
        public void obrisi(int id) {
            korisnikPomociRepository.deleteById(id);
        }
    }


