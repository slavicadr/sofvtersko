package com.fakultet.dobrobit.repositories;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.enums.TipKorisnika;
import com.fakultet.dobrobit.enums.StatusNaloga;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;


    @Repository
    public interface KorisnikRepository extends JpaRepository<Korisnik, Integer> {

        Optional<Korisnik> findByEmail(String email);

        boolean existsByEmail(String email);

        List<Korisnik> findByTipKorisnika(TipKorisnika tipKorisnika);

        List<Korisnik> findByStatusNaloga(StatusNaloga statusNaloga);

        List<Korisnik> findByTipKorisnikaAndStatusNaloga(
                TipKorisnika tipKorisnika,
                StatusNaloga statusNaloga
        );

        List<Korisnik> findByVerifikovanTrue();

        List<Korisnik> findByImeContainingIgnoreCaseOrPrezimeContainingIgnoreCase(
                String ime,
                String prezime
        );

    }

