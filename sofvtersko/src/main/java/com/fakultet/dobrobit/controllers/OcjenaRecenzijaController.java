package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.OcjenaRecenzija;
import com.fakultet.dobrobit.services.OcjenaRecenzijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recenzije")
public class OcjenaRecenzijaController {

    private final OcjenaRecenzijaService service;

    public OcjenaRecenzijaController(OcjenaRecenzijaService service) {
        this.service = service;
    }

    // Javno — sve recenzije (SRS 10)
    @GetMapping
    public List<OcjenaRecenzija> prikaziSve() {
        return service.getAll();
    }

    // Recenzije za određenu uslugu — javno vidljivo
    @GetMapping("/usluga/{uslugaId}")
    public List<OcjenaRecenzija> poUslugama(@PathVariable int uslugaId) {
        return service.getByUsluga(uslugaId);
    }

    // Recenzije određenog kupca — za dashboard (SRS 6.3)
    @GetMapping("/kupac/{kupacId}")
    public List<OcjenaRecenzija> poKupcu(@PathVariable int kupacId) {
        return service.getByKupac(kupacId);
    }

    // Sve recenzije za usluge određenog volontera — za volonter dashboard
    @GetMapping("/volonter/{volonterId}")
    public List<OcjenaRecenzija> poVolonteru(@PathVariable int volonterId) {
        return service.getByVolonter(volonterId);
    }

    // Prosječna ocjena volontera — za profil volontera (SRS 3.1)
    @GetMapping("/volonter/{volonterId}/prosjek")
    public ResponseEntity<?> prosjecnaOcjena(@PathVariable int volonterId) {
        double prosjek = service.getProsjecnaOcjena(volonterId);
        return ResponseEntity.ok(Map.of("volonterId", volonterId, "prosjecnaOcjena", prosjek));
    }

    // Dodaj recenziju — samo kupac (SRS UC-6)
    // Body: { "kupovinaId": 1, "kupacId": 1, "brojZvjezdica": 5, "komentar": "Odlično!" }
    @PostMapping("/dodaj")
    public ResponseEntity<?> dodaj(@RequestBody Map<String, Object> podaci) {
        try {
            int kupovinaId = (Integer) podaci.get("kupovinaId");
            int kupacId = (Integer) podaci.get("kupacId");
            int brojZvjezdica = (Integer) podaci.get("brojZvjezdica");
            String komentar = (String) podaci.getOrDefault("komentar", "");

            OcjenaRecenzija nova = service.dodajRecenziju(kupovinaId, kupacId, brojZvjezdica, komentar);
            return ResponseEntity.ok(nova);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Brisanje neprimjerenih recenzija — samo administrator (SRS 5.3)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            service.obrisi(id);
            return ResponseEntity.ok("Recenzija obrisana.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
