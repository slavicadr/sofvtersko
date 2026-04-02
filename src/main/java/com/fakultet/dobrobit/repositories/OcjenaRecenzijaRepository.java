package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.OcjenaRecenzija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KupljenaUsluga;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

    @Repository
    public interface OcjenaRecenzijaRepository extends JpaRepository<OcjenaRecenzija, Integer> {

        Optional<OcjenaRecenzija> findByKupovina(KupljenaUsluga kupovina);

        List<OcjenaRecenzija> findByOcjenjivac(Korisnik ocjenjivac);

        List<OcjenaRecenzija> findByBrojZvjezdica(int brojZvjezdica);

        List<OcjenaRecenzija> findByOcjenjivacAndBrojZvjezdica(Korisnik ocjenjivac, int brojZvjezdica);
    }
