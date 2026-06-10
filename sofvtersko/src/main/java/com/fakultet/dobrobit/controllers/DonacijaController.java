package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Donacija;
import com.fakultet.dobrobit.services.DonacijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donacije")
public class DonacijaController {

    private final DonacijaService donacijaService;

    public DonacijaController(DonacijaService donacijaService) {
        this.donacijaService = donacijaService;
    }

    @GetMapping
    public List<Donacija> prikaziSveDonacije() {
        return donacijaService.getAllDonacije();
    }

    @PostMapping
    public ResponseEntity<?> novaDonacija(@RequestBody Map<String, Object> podaci) {
        try {
            // donatorId is optional — null means guest/anonymous donor
            Integer donatorId = null;
            Object donatorIdObj = podaci.get("donatorId");
            if (donatorIdObj instanceof Number) {
                donatorId = ((Number) donatorIdObj).intValue();
                if (donatorId <= 0) donatorId = null;
            }

            // pomocId is required
            Object pomocIdObj = podaci.get("pomocId");
            if (!(pomocIdObj instanceof Number)) {
                return ResponseEntity.badRequest().body("Nedostaje ili je neispravan pomocId.");
            }
            int pomocId = ((Number) pomocIdObj).intValue();

            // iznos is required
            Object iznosObj = podaci.get("iznos");
            if (iznosObj == null) {
                return ResponseEntity.badRequest().body("Nedostaje iznos.");
            }
            BigDecimal iznos = new BigDecimal(iznosObj.toString());

            String nacinPlacanja = (String) podaci.getOrDefault("nacinPlacanja", "KARTICA");
            boolean anonimno = Boolean.TRUE.equals(podaci.get("anonimno"));

            Donacija sacuvana = donacijaService.kreirajDonaciju(donatorId, pomocId, iznos, nacinPlacanja, anonimno);
            return ResponseEntity.ok(sacuvana);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Donacija> azurirajStatus(
            @PathVariable int id,
            @RequestParam String noviStatus) {
        try {
            Donacija d = donacijaService.promijeniStatusDonacije(id, noviStatus);
            return ResponseEntity.ok(d);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
