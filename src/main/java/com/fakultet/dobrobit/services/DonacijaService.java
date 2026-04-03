package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Donacija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.repositories.DonacijaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

    @Service
    public class DonacijaService {

        private final DonacijaRepository donacijaRepository;

        public DonacijaService(DonacijaRepository donacijaRepository) {
            this.donacijaRepository = donacijaRepository;
        }

        public Donacija kreirajDonaciju(Donacija donacija) {

            donacija.setDatumDonacije(LocalDateTime.now());
            donacija.setStatusDonacije("na_cekanju");
            donacija.setStatusPlacanja("neplaceno");

            return donacijaRepository.save(donacija);
        }

        public List<Donacija> getAllDonacije() {
            return donacijaRepository.findAll();
        }

        public List<Donacija> getDonacijeByDonator(Korisnik donator) {
            return donacijaRepository.findByDonator(donator);
        }

        public List<Donacija> getDonacijeByPomoc(KorisnikPomoci pomoc) {
            return donacijaRepository.findByKorisnikPomoci(pomoc);
        }

        public Donacija promijeniStatusDonacije(int id, String status) {
            Donacija d = donacijaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Donacija ne postoji"));

            d.setStatusDonacije(status);
            return donacijaRepository.save(d);
        }


    }

