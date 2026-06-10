package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Donacija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

    @Repository
    public interface DonacijaRepository extends JpaRepository<Donacija, Integer> {

        List<Donacija> findByDonator(Korisnik donator);

        List<Donacija> findByKorisnikPomoci(KorisnikPomoci korisnikPomoci);

        List<Donacija> findByStatusDonacije(String statusDonacije);

        List<Donacija> findByStatusPlacanja(String statusPlacanja);

        List<Donacija> findByDonatorAndStatusDonacije(Korisnik donator, String statusDonacije);
    }

