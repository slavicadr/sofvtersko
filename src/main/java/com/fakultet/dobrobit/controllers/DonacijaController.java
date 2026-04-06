package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Donacija;
import com.fakultet.dobrobit.services.DonacijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donacije")
public class DonacijaController {
    private final DonacijaService donacijaService;

    //injekcija servisa preko konstruktora
    public DonacijaController(DonacijaService donacijaService) {
        this.donacijaService=donacijaService;
    }

    @GetMapping
    public List<Donacija> prikaziSveDonacije() {
        return donacijaService.getAllDonacije();
    }

    @PostMapping
    public ResponseEntity<Donacija> novaDonacija(@RequestBody Donacija donacija) {
        Donacija sacuvanaDonacija=donacijaService.kreirajDonaciju(donacija);
        return ResponseEntity.ok(sacuvanaDonacija);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Donacija> azurirajStatus(
            @PathVariable int id,
            @RequestParam String noviStatus) {
        try {
            Donacija d=donacijaService.promijeniStatusDonacije(id, noviStatus);
            return ResponseEntity.ok(d);
        } catch(RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
