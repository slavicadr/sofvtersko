package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Kategorija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;


 @Repository
    public interface KategorijaRepository extends JpaRepository<Kategorija, Integer> {

        Optional<Kategorija> findByNaziv(String naziv);

        boolean existsByNaziv(String naziv);

        List<Kategorija> findByNazivContainingIgnoreCase(String naziv);
    }

