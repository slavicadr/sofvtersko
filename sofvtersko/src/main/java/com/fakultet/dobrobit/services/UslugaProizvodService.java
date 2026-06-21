package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.Kategorija;
import com.fakultet.dobrobit.repositories.KategorijaRepository;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.repositories.KupljenaUslugaRepository;
import com.fakultet.dobrobit.repositories.UslugaProizvodRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
    public class UslugaProizvodService {

        private final UslugaProizvodRepository repository;
        private final KategorijaRepository kategorijaRepository;
        private final KorisnikRepository korisnikRepository;
        private final KupljenaUslugaRepository kupljenaUslugaRepository;
        private final EmailService emailService;

        public UslugaProizvodService(UslugaProizvodRepository repository,
                                     KategorijaRepository kategorijaRepository,
                                     KorisnikRepository korisnikRepository,
                                     KupljenaUslugaRepository kupljenaUslugaRepository,
                                     EmailService emailService) {
            this.repository = repository;
            this.kategorijaRepository = kategorijaRepository;
            this.korisnikRepository = korisnikRepository;
            this.kupljenaUslugaRepository = kupljenaUslugaRepository;
            this.emailService = emailService;
        }

        public UslugaProizvod kreiraj(UslugaProizvod usluga) {
            // Load the managed Korisnik entity by ID to avoid detached-entity errors
            if (usluga.getVolonter() != null && usluga.getVolonter().getKorisnikId() > 0) {
                Korisnik volonter = korisnikRepository.findById(usluga.getVolonter().getKorisnikId())
                    .orElseThrow(() -> new RuntimeException("Volonter sa ID " + usluga.getVolonter().getKorisnikId() + " ne postoji"));
                usluga.setVolonter(volonter);
            }

            // Resolve kategorija by name when only naziv was sent (no ID)
            if (usluga.getKategorija() != null && usluga.getKategorija().getKategorijaId() == 0) {
                String naziv = usluga.getKategorija().getNaziv();
                if (naziv != null && !naziv.isBlank()) {
                    Kategorija k = kategorijaRepository.findByNaziv(naziv)
                        .orElseGet(() -> kategorijaRepository.save(new Kategorija(naziv, "")));
                    usluga.setKategorija(k);
                }
            }

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

        public List<UslugaProizvod> getByVolonterPublic(int volonterId) {
            return repository.findByVolonter_KorisnikId(volonterId);
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
            UslugaProizvod sacuvana = repository.save(u);

            if ("aktivna".equals(status) && u.getVolonter() != null) {
                Korisnik v = u.getVolonter();
                emailService.posaljiOdobrenjeUsluge(
                        v.getEmail(),
                        v.getIme() + " " + v.getPrezime(),
                        u.getNaziv()
                );
            }

            return sacuvana;
        }

        public void obrisi(int id) {
            UslugaProizvod usluga = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Usluga ne postoji."));

            if (kupljenaUslugaRepository.countByUslugaProizvod(usluga) > 0) {
                throw new RuntimeException("Nije moguće obrisati uslugu koja je već kupljena ili realizovana. Možete je deaktivirati.");
            }

            repository.deleteById(id);
        }
    }

