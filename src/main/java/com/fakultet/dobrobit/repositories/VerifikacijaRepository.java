package com.fakultet.dobrobit.repository;

import com.fakultet.dobrobit.models.Verifikacija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.UslugaProizvod;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerifikacijaRepository extends JpaRepository<Verifikacija, Integer> {

    List<Verifikacija> findByKorisnik(Korisnik korisnik);

    List<Verifikacija> findByUslugaProizvod(UslugaProizvod uslugaProizvod);

    List<Verifikacija> findByAdministrator(Korisnik administrator);

    List<Verifikacija> findByStatus(String status);

    List<Verifikacija> findByTipVerifikacije(String tipVerifikacije);

    List<Verifikacija> findByAdministratorAndStatus(Korisnik administrator, String status);
}