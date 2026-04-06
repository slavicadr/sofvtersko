package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.KorisnikServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/korisnici")
public class KorisnikController {
    private final KorisnikServices korisnikServices;

    //injection
    public KorisnikController(KorisnikServices korisnikServices) {
        this.korisnikServices = korisnikServices;
    }

    //registracija novog korisnika
    @PostMapping("/registracija")
    public ResponseEntity<?> registruj(@RequestBody Korisnik korisnik) {
        try {
            //poziva se servis za registraciju (postavlja datum, status na_cekanju...)
            Korisnik noviKorisnik = korisnikServices.registrujKorisnika(korisnik);
            return ResponseEntity.ok(noviKorisnik);
        } catch (RuntimeException e) {
            //ako email vec postoji
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //login korisnika
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String lozinka) {
        Optional<Korisnik> korisnik = korisnikServices.login(email, lozinka);

        if (korisnik.isPresent()) {
            // Ako su podaci tačni, vraćamo korisnika
            return ResponseEntity.ok(korisnik.get());
        } else {
            // Ako nisu, vraćamo šifru 401 (Unauthorized)
            return ResponseEntity.status(401).body("Pogrešan email ili lozinka!");
        }
    }

    @GetMapping
    public List<Korisnik> prikaziSve() {
        return korisnikServices.getAllKorisnici();
    }

    //pristup jednom korisniku po id-u
    @GetMapping("/{id}")
    public ResponseEntity<Korisnik> prikaziPoId(@PathVariable int id) {
        return korisnikServices.getKorisnikById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            korisnikServices.obrisiKorisnika(id);
            return ResponseEntity.ok("Korisnik obrisan.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
