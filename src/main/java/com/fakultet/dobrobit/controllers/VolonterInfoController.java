package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.services.VolonterInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volonter-info")
public class VolonterInfoController {

    private final VolonterInfoService service;

    public VolonterInfoController(VolonterInfoService service) {
        this.service = service;
    }

    // Svi volonteri — javno (SRS 9)
    @GetMapping
    public List<VolonterInfo> prikaziSve() {
        return service.getAll();
    }

    // Aktivni volonteri (imaju realizovanih usluga)
    @GetMapping("/aktivni")
    public List<VolonterInfo> aktivni() {
        return service.aktivni();
    }

    // Dashboard volontera (SRS 3.1)
    @GetMapping("/{volonterId}/dashboard")
    public ResponseEntity<?> dashboard(@PathVariable int volonterId) {
        try {
            return ResponseEntity.ok(service.getDashboard(volonterId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kreiranje volonter profila
    // Body: { "volonterId": 1, "biografija": "...", "portfolioLink": "..." }
    @PostMapping
    public ResponseEntity<?> kreiraj(@RequestBody Map<String, Object> podaci) {
        try {
            int volonterId = (Integer) podaci.get("volonterId");
            String biografija = (String) podaci.getOrDefault("biografija", "");
            String portfolioLink = (String) podaci.getOrDefault("portfolioLink", "");

            VolonterInfo novi = service.kreiraj(volonterId, biografija, portfolioLink);
            return ResponseEntity.ok(novi);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ažuriranje biografije i portfolio linka
    @PutMapping("/{volonterId}")
    @PreAuthorize("hasAnyRole('volonter','administrator')")
    public ResponseEntity<?> azuriraj(@PathVariable int volonterId,
                                      @RequestBody Map<String, Object> podaci) {
        try {
            String biografija = (String) podaci.get("biografija");
            String portfolioLink = (String) podaci.get("portfolioLink");
            VolonterInfo updated = service.azuriraj(volonterId, biografija, portfolioLink);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Brisanje — samo admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            service.obrisi(id);
            return ResponseEntity.ok("Volonter profil obrisan.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
