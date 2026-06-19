package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.PomogliSlucaj;
import com.fakultet.dobrobit.repositories.PomogliSlucajRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pomogli-slucajevi")
public class PomogliSlucajController {

    private final PomogliSlucajRepository repo;

    public PomogliSlucajController(PomogliSlucajRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<PomogliSlucaj> getAll() {
        return repo.findAllByOrderByRedoslijedAscDatumDodavanjaAsc();
    }

    @PostMapping
    @PreAuthorize("hasRole('administrator')")
    public PomogliSlucaj dodaj(@RequestBody PomogliSlucaj slucaj) {
        return repo.save(slucaj);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<PomogliSlucaj> azuriraj(@PathVariable Long id, @RequestBody PomogliSlucaj podaci) {
        return repo.findById(id).map(s -> {
            s.setNaslov(podaci.getNaslov());
            s.setTekst(podaci.getTekst());
            s.setBoja(podaci.getBoja());
            s.setRedoslijed(podaci.getRedoslijed());
            return ResponseEntity.ok(repo.save(s));
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
