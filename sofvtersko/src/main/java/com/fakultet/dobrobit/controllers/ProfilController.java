package com.fakultet.dobrobit.controllers;
import com.fakultet.dobrobit.models.Profil;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.ProfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/profili")
public class ProfilController {
    private final ProfilService profilService;

    public ProfilController(ProfilService profilService) {
        this.profilService = profilService;
    }

    @GetMapping
    public List<Profil> prikaziSve() {
        return profilService.getAll();
    }

    //novi profil za korisnika
    @PostMapping
    public ResponseEntity<?> napraviProfil(@RequestBody Profil profil) {
        try {
            // Servis proverava da li profil za ovog korisnika već postoji (OneToOne veza)
            Profil noviProfil = profilService.kreirajProfil(profil);
            return ResponseEntity.ok(noviProfil);
        } catch (RuntimeException e) {
            // Vraća grešku ako korisnik već ima profil
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //pronalazenje profila preko objekta korisnika
    @PostMapping("/pretraga-korisnik")
    public ResponseEntity<?> poKorisniku(@RequestBody Korisnik korisnik) {
        try {
            Profil p = profilService.getByKorisnik(korisnik);
            return ResponseEntity.ok(p);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //filtriranje najbolje ocijenjenih korisnika
    @GetMapping("/najbolji")
    public List<Profil> prikaziNajbolje(@RequestParam BigDecimal ocena) {
        return profilService.getNajbolji(ocena);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            profilService.obrisi(id);
            return ResponseEntity.ok("Profil uspešno obrisan.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
