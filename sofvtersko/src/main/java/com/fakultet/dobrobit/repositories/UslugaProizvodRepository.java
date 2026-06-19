package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.Kategorija;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


    @Repository
    public interface UslugaProizvodRepository extends JpaRepository<UslugaProizvod, Integer> {

        List<UslugaProizvod> findByVolonter(Korisnik volonter);

        List<UslugaProizvod> findByVolonter_KorisnikId(int korisnikId);

        List<UslugaProizvod> findByKategorija(Kategorija kategorija);

        List<UslugaProizvod> findByTip(String tip);

        List<UslugaProizvod> findByStatusObjave(String statusObjave);

        List<UslugaProizvod> findByKategorijaAndStatusObjave(Kategorija kategorija, String statusObjave);

        List<UslugaProizvod> findByNazivContainingIgnoreCase(String naziv);
    }

