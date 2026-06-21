package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Katalog;
import com.fakultet.dobrobit.repositories.KatalogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/katalozi")
public class KatalogController {

    private final KatalogRepository repo;

    public KatalogController(KatalogRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Katalog> getAll() {
        return repo.findAllByOrderByRedoslijedAscDatumDodavanjaAsc();
    }

    @PostMapping
    @PreAuthorize("hasRole('administrator')")
    public Katalog dodaj(@RequestBody Katalog katalog) {
        return repo.save(katalog);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Katalog> azuriraj(@PathVariable Long id, @RequestBody Katalog podaci) {
        return repo.findById(id).map(k -> {
            k.setNaslov(podaci.getNaslov());
            k.setOpis(podaci.getOpis());
            k.setPdfUrl(podaci.getPdfUrl());
            k.setRedoslijed(podaci.getRedoslijed());
            return ResponseEntity.ok(repo.save(k));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Void> obrisi(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
