package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.services.KupljenaUslugaService;
import org.springframework.http.ResponseEntity;
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
            int kupacId = (Integer) podaci.get("kupacId");
            int uslugaId = (Integer) podaci.get("uslugaId");
            int pomocId = (Integer) podaci.get("pomocId");
            String nacinPlacanja = (String) podaci.getOrDefault("nacinPlacanja", "KARTICA");

            // Iznos je opcionalan — ako nije proslijeđen uzima se cijena usluge
            BigDecimal iznos = podaci.containsKey("iznos")
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
}
