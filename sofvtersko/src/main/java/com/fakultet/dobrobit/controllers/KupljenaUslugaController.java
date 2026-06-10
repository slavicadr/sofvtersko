package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.KupljenaUslugaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kupovine")
public class KupljenaUslugaController {

    private final KupljenaUslugaService service;

    public KupljenaUslugaController(KupljenaUslugaService service) {
        this.service = service;
    }

    @GetMapping
    public List<KupljenaUsluga> prikaziSve() {
        return service.getAll();
    }

    // Kupac kupuje uslugu (SRS UC-3)
    // Body: { "kupacId": 1, "uslugaId": 1, "pomocId": 1, "nacinPlacanja": "KARTICA" }
    @PostMapping("/kupi")
    public ResponseEntity<?> kupi(@RequestBody Map<String, Object> podaci) {
        try {
            Object kupacIdObj = podaci.get("kupacId");
            if (!(kupacIdObj instanceof Number)) return ResponseEntity.badRequest().body("Nedostaje kupacId.");
            int kupacId = ((Number) kupacIdObj).intValue();

            Object uslugaIdObj = podaci.get("uslugaId");
            if (!(uslugaIdObj instanceof Number)) return ResponseEntity.badRequest().body("Nedostaje uslugaId.");
            int uslugaId = ((Number) uslugaIdObj).intValue();

            Object pomocIdObj = podaci.get("pomocId");
            if (!(pomocIdObj instanceof Number)) return ResponseEntity.badRequest().body("Nedostaje pomocId.");
            int pomocId = ((Number) pomocIdObj).intValue();

            String nacinPlacanja = (String) podaci.getOrDefault("nacinPlacanja", "KARTICA");

            BigDecimal iznos = podaci.containsKey("iznos") && podaci.get("iznos") != null
                    ? new BigDecimal(podaci.get("iznos").toString())
                    : null;

            KupljenaUsluga nova = service.kupiUslugu(kupacId, uslugaId, pomocId, iznos, nacinPlacanja);
            return ResponseEntity.ok(nova);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kupovine određenog kupca — za dashboard (SRS 6.2)
    @GetMapping("/kupac/{kupacId}")
    public ResponseEntity<?> poKupcu(@PathVariable int kupacId) {
        try {
            return ResponseEntity.ok(service.getByDonator(kupacId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kupovine za određenog korisnika pomoći
    @GetMapping("/pomoc/{pomocId}")
    public ResponseEntity<?> poPomoci(@PathVariable int pomocId) {
        try {
            return ResponseEntity.ok(service.getByPomoc(pomocId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> izmijeniStatus(@PathVariable int id, @RequestParam String noviStatus) {
        try {
            return ResponseEntity.ok(service.promijeniStatus(id, noviStatus));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Označi uslugu kao realizovanu — kupac, volonter ili admin
    @PatchMapping("/{id}/realizovano")
    public ResponseEntity<?> oznaciRealizovano(@PathVariable int id,
                                               @AuthenticationPrincipal Korisnik principal) {
        if (principal == null) return ResponseEntity.status(401).body("Nije prijavljen.");
        try {
            String role = principal.getTipKorisnika().name();
            KupljenaUsluga updated = service.oznaciRealizovano(id, principal.getKorisnikId(), role);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kupovine za određenog volontera — za volonter dashboard
    @GetMapping("/volonter/{volonterId}")
    public ResponseEntity<?> poVolonteru(@PathVariable int volonterId) {
        try {
            return ResponseEntity.ok(service.getByVolonter(volonterId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
