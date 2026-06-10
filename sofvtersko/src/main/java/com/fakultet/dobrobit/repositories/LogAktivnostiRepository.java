package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.LogAktivnosti;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogAktivnostiRepository extends JpaRepository<LogAktivnosti, Integer> {

    List<LogAktivnosti> findByKorisnik(Korisnik korisnik);

    List<LogAktivnosti> findByTipAktivnosti(String tipAktivnosti);

    // Neuspješni pokušaji prijave u zadnjih N minuta — za detekciju rizika (SRS 5.1.3)
    List<LogAktivnosti> findByTipAktivnostiAndVrijemeAktivnostiAfter(
            String tip, LocalDateTime od);

    // Logovi za određenog korisnika sortirani po vremenu
    List<LogAktivnosti> findByKorisnikOrderByVrijemeAktivnostiDesc(Korisnik korisnik);

    // Svi logovi sortirani — za admin pregled (SRS 5.5)
    List<LogAktivnosti> findAllByOrderByVrijemeAktivnostiDesc();
}
