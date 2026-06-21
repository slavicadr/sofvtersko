package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.OcjenaRecenzija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OcjenaRecenzijaRepository extends JpaRepository<OcjenaRecenzija, Integer> {

    Optional<OcjenaRecenzija> findByKupovinaAndOcjenjivac(KupljenaUsluga kupovina, Korisnik ocjenjivac);

    // Recenzije za određenu uslugu/proizvod
    List<OcjenaRecenzija> findByKupovina_UslugaProizvod_UslugaProizvodId(int uslugaId);

    // Recenzije određenog kupca
    List<OcjenaRecenzija> findByOcjenjivac_KorisnikId(int kupacId);

    // Sve recenzije za usluge određenog volontera
    List<OcjenaRecenzija> findByKupovina_UslugaProizvod_Volonter_KorisnikId(int volonterId);

    // Samo recenzije kupaca (isključuje volonterove vlastite recenzije)
    List<OcjenaRecenzija> findByKupovina_UslugaProizvod_Volonter_KorisnikIdAndOcjenjivac_KorisnikIdNot(int volonterId, int excludeId);

    List<OcjenaRecenzija> findByBrojZvjezdica(int broj);
}
