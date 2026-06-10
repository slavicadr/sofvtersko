package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Profil;
import com.fakultet.dobrobit.models.Korisnik;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;


    @Repository
    public interface ProfilRepository extends JpaRepository<Profil, Integer> {

        Optional<Profil> findByKorisnik(Korisnik korisnik);

        List<Profil> findByGrad(String grad);

        List<Profil> findByGradContainingIgnoreCase(String grad);

        List<Profil> findByProsjecnaOcjenaGreaterThanEqual(java.math.BigDecimal ocjena);
    }

