package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.models.Korisnik;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

   @Repository
    public interface KorisnikPomociRepository extends JpaRepository<KorisnikPomoci, Integer> {

        Optional<KorisnikPomoci> findByKorisnik(Korisnik korisnik);
        List<KorisnikPomoci> findByNazivContainingIgnoreCase(String naziv);
        List<KorisnikPomoci> findByStatusSlucaja(String statusSlucaja);

    }

