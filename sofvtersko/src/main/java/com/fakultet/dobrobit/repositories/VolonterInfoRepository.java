package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.models.Korisnik;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

    @Repository
    public interface VolonterInfoRepository extends JpaRepository<VolonterInfo, Integer> {

        Optional<VolonterInfo> findByKorisnik(Korisnik korisnik);

        List<VolonterInfo> findByBrojUslugaGreaterThan(int broj);


//        List<VolonterInfo> findByBiografijaContainingIgnoreCase(String tekst);
    }

