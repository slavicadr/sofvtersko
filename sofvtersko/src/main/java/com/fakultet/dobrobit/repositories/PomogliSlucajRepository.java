package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.PomogliSlucaj;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PomogliSlucajRepository extends JpaRepository<PomogliSlucaj, Long> {
    List<PomogliSlucaj> findAllByOrderByRedoslijedAscDatumDodavanjaAsc();
}
