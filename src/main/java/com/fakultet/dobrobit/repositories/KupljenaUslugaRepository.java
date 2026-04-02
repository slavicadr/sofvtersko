package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.models.UslugaProizvod;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

    @Repository
    public interface KupljenaUslugaRepository extends JpaRepository<KupljenaUsluga, Integer> {

        List<KupljenaUsluga> findByDonator(Korisnik donator);

        List<KupljenaUsluga> findByKorisnikPomoci(KorisnikPomoci korisnikPomoci);

//        List<KupljenaUsluga> findByUslugaProizvod(UslugaProizvod uslugaProizvod);


        List<KupljenaUsluga> findByStatusPlacanja(String statusPlacanja);

        List<KupljenaUsluga> findByDonatorAndStatusPlacanja(Korisnik donator, String statusPlacanja);
    }

