package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Katalog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KatalogRepository extends JpaRepository<Katalog, Long> {
    List<Katalog> findAllByOrderByRedoslijedAscDatumDodavanjaAsc();
}
