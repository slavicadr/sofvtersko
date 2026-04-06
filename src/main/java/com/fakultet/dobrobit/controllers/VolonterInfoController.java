package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.VolonterInfo;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.VolonterInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volonter-info")
public class VolonterInfoController {
    private final VolonterInfoService volonterInfoService;

    public VolonterInfoController(VolonterInfoService volonterInfoService) {
        this.volonterInfoService = volonterInfoService;
    }

    @GetMapping
    public List<VolonterInfo> prikaziSve() {
        return volonterInfoService.getAll();
    }

    //dodatni profil za volontera
    @PostMapping
    public ResponseEntity<?> kreirajProfil(@RequestBody VolonterInfo volonterInfo) {
        try {
            // Servis provjerava da li volonter već ima popunjen info profil
            VolonterInfo novi = volonterInfoService.kreiraj(volonterInfo);
            return ResponseEntity.ok(novi);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //nalazenje informacija o volonteru na osnovu njegovog osnovnog korisnickog naloga
    @PostMapping("/pretraga-korisnik")
    public ResponseEntity<?> poKorisniku(@RequestBody Korisnik korisnik) {
        try {
            VolonterInfo v = volonterInfoService.getByKorisnik(korisnik);
            return ResponseEntity.ok(v);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //aktivni volonteri
    @GetMapping("/aktivni")
    public List<VolonterInfo> prikaziAktivne() {
        return volonterInfoService.aktivni();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            volonterInfoService.obrisi(id);
            return ResponseEntity.ok("Informacije o volonteru uspješno obrisane.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
