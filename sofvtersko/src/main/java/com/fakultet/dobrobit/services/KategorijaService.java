// KategorijaService.java
package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Kategorija;
import com.fakultet.dobrobit.repositories.KategorijaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KategorijaService {

    private final KategorijaRepository kategorijaRepository;

    public KategorijaService(KategorijaRepository kategorijaRepository) {
        this.kategorijaRepository = kategorijaRepository;
    }

    public Kategorija dodajKategoriju(Kategorija kategorija) {
        if (kategorijaRepository.existsByNaziv(kategorija.getNaziv())) {
            throw new RuntimeException("Kategorija već postoji!");
        }
        return kategorijaRepository.save(kategorija);
    }

    public List<Kategorija> getAllKategorije() {
        return kategorijaRepository.findAll();
    }

    public List<Kategorija> pretraziKategorije(String naziv) {
        return kategorijaRepository.findByNazivContainingIgnoreCase(naziv);
    }

    public Kategorija updateKategorija(int id, Kategorija noviPodaci) {
        Kategorija postojeca = kategorijaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategorija ne postoji"));

        if (!postojeca.getNaziv().equals(noviPodaci.getNaziv()) &&
                kategorijaRepository.existsByNaziv(noviPodaci.getNaziv())) {
            throw new RuntimeException("Kategorija s tim nazivom već postoji!");
        }

        postojeca.setNaziv(noviPodaci.getNaziv());
        return kategorijaRepository.save(postojeca);
    }

    public void obrisiKategoriju(int id) {
        if (!kategorijaRepository.existsById(id)) {
            throw new RuntimeException("Kategorija ne postoji");
        }
        kategorijaRepository.deleteById(id);
    }
}