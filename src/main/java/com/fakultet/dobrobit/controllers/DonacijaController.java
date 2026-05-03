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
            int donatorId = (Integer) podaci.get("donatorId");
            int pomocId = (Integer) podaci.get("pomocId");
            BigDecimal iznos = new BigDecimal(podaci.get("iznos").toString());
            String nacinPlacanja = (String) podaci.getOrDefault("nacinPlacanja", "KARTICA");

            Donacija sacuvana = donacijaService.kreirajDonaciju(donatorId, pomocId, iznos, nacinPlacanja);
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
