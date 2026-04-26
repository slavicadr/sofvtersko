package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.KorisnikServices;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/korisnici")
public class KorisnikController {

    private final KorisnikServices korisnikServices;

    public KorisnikController(KorisnikServices korisnikServices) {
        this.korisnikServices = korisnikServices;
    }

    // ── Registracija ─────────────────────────────────────────────────────────

    @PostMapping("/registracija")
    public ResponseEntity<?> registruj(@Valid @RequestBody Korisnik korisnik) {
        try {
            Korisnik novi = korisnikServices.registrujKorisnika(korisnik);
            return ResponseEntity.ok(novi);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Poseban endpoint za kupca — odmah aktivan, može biti anoniman (SRS 6.1)
    @PostMapping("/registracija/kupac")
    public ResponseEntity<?> registrujKupca(@Valid @RequestBody Korisnik korisnik) {
        try {
            Korisnik novi = korisnikServices.registrujKupca(korisnik);
            return ResponseEntity.ok(novi);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> podaci) {
        try {
            String email = podaci.get("email");
            String lozinka = podaci.get("lozinka");
            Korisnik korisnik = korisnikServices.login(email, lozinka);
            return ResponseEntity.ok(korisnik);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Pogrešan email ili lozinka.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // ── Čitanje (samo admin) ──────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('administrator')")
    public List<Korisnik> prikaziSve() {
        return korisnikServices.getAllKorisnici();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Korisnik> prikaziPoId(@PathVariable int id) {
        return korisnikServices.getKorisnikById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tip/{tip}")
    @PreAuthorize("hasRole('administrator')")
    public List<Korisnik> prikaziPoTipu(@PathVariable TipKorisnika tip) {
        return korisnikServices.getByTip(tip);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('administrator')")
    public List<Korisnik> prikaziPoStatusu(@PathVariable StatusNaloga status) {
        return korisnikServices.getByStatus(status);
    }

    // ── Promjena statusa (SRS 5.3 / 5.3.1) — samo admin ─────────────────────

    // Body: { "noviStatus": "suspendovan", "razlog": "Kršenje pravila ponašanja" }
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<?> promijeniStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> podaci) {
        try {
            String statusStr = podaci.get("noviStatus");
            String razlog = podaci.get("razlog");

            if (razlog == null || razlog.isBlank()) {
                return ResponseEntity.badRequest().body("Razlog promjene statusa je obavezan.");
            }

            StatusNaloga noviStatus = StatusNaloga.valueOf(statusStr);
            Korisnik k = korisnikServices.promijeniStatus(id, noviStatus, razlog);
            return ResponseEntity.ok(k);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Nevažeći status: " + podaci.get("noviStatus"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Brisanje (samo admin) ─────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            korisnikServices.obrisiKorisnika(id);
            return ResponseEntity.ok("Korisnik obrisan.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
