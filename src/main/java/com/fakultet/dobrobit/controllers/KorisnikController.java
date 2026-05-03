package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.KorisnikServices;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // ── Registracija ──────────────────────────────────────────────────────────

    @PostMapping("/registracija")
    public ResponseEntity<?> registruj(@Valid @RequestBody Korisnik korisnik) {
        try {
            return ResponseEntity.ok(korisnikServices.registrujKorisnika(korisnik));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registracija/kupac")
    public ResponseEntity<?> registrujKupca(@Valid @RequestBody Korisnik korisnik) {
        try {
            return ResponseEntity.ok(korisnikServices.registrujKupca(korisnik));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Login / Logout ────────────────────────────────────────────────────────

    // Body: { "email": "...", "lozinka": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> podaci,
                                   HttpServletRequest request) {
        try {
            String ipAdresa = request.getRemoteAddr();
            Korisnik korisnik = korisnikServices.login(
                    podaci.get("email"),
                    podaci.get("lozinka"),
                    ipAdresa
            );
            return ResponseEntity.ok(korisnik);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    // Body: { "korisnikId": 1 }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map<String, Integer> podaci,
                                         HttpServletRequest request) {
        korisnikServices.logout(podaci.get("korisnikId"), request.getRemoteAddr());
        return ResponseEntity.ok("Odjava uspješna.");
    }

    // ── Čitanje — samo admin ──────────────────────────────────────────────────

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
    public List<Korisnik> poTipu(@PathVariable TipKorisnika tip) {
        return korisnikServices.getByTip(tip);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('administrator')")
    public List<Korisnik> poStatusu(@PathVariable StatusNaloga status) {
        return korisnikServices.getByStatus(status);
    }

    // ── Promjena statusa — samo admin (SRS 5.3.1) ────────────────────────────

    // Body: { "noviStatus": "suspendovan", "razlog": "Kršenje pravila" }
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<?> promijeniStatus(@PathVariable int id,
                                             @RequestBody Map<String, String> podaci) {
        try {
            StatusNaloga noviStatus = StatusNaloga.valueOf(podaci.get("noviStatus"));
            String razlog = podaci.get("razlog");
            return ResponseEntity.ok(korisnikServices.promijeniStatus(id, noviStatus, razlog));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Nevažeći status: " + podaci.get("noviStatus"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Brisanje — samo admin ─────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        korisnikServices.obrisiKorisnika(id);
        return ResponseEntity.ok("Korisnik obrisan.");
    }
}
