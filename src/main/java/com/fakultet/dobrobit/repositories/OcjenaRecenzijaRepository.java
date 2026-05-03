package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.OcjenaRecenzija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OcjenaRecenzijaRepository extends JpaRepository<OcjenaRecenzija, Integer> {

    Optional<OcjenaRecenzija> findByKupovina(KupljenaUsluga kupovina);

    // Recenzije za određenu uslugu/proizvod
    List<OcjenaRecenzija> findByKupovina_UslugaProizvod_UslugaProizvodId(int uslugaId);

    // Recenzije određenog kupca
    List<OcjenaRecenzija> findByOcjenjivac_KorisnikId(int kupacId);

    // Sve recenzije za usluge određenog volontera
    List<OcjenaRecenzija> findByKupovina_UslugaProizvod_Volonter_KorisnikId(int volonterId);

    List<OcjenaRecenzija> findByBrojZvjezdica(int broj);
}
