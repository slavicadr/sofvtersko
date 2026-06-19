package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.Kategorija;
import com.fakultet.dobrobit.services.UslugaProizvodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usluge-proizvodi")
public class UslugaProizvodController {
    private final UslugaProizvodService service;

    public UslugaProizvodController(UslugaProizvodService service) {
        this.service = service;
    }

    @GetMapping
    public List<UslugaProizvod> prikaziSve() {
        return service.getAll();
    }

    //kreiranje nove usluge ili proizvoda od strane korisnika
    @PostMapping
    public ResponseEntity<?> kreirajNovu(@RequestBody UslugaProizvod usluga) {
        try {
            UslugaProizvod nova = service.kreiraj(usluga);
            return ResponseEntity.ok(nova);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //pretraga usluga po nazivu
    @GetMapping("/pretraga")
    public List<UslugaProizvod> pretraziPoNazivu(@RequestParam String naziv) {
        return service.pretrazi(naziv);
    }

    // Javne usluge određenog volontera — za profil stranicu
    @GetMapping("/volonter/{volonterId}")
    public List<UslugaProizvod> uslugePovoljneZaVolontera(@PathVariable int volonterId) {
        return service.getByVolonterPublic(volonterId);
    }

    //filtriranje usluga po volonteru koji ih nudi
    @PostMapping("/filter-volonter")
    public List<UslugaProizvod> poVolonteru(@RequestBody Korisnik volonter) {
        return service.getByVolonter(volonter);
    }

    //filtriranje usluga po kategoriji
    @PostMapping("/filter-kategorija")
    public List<UslugaProizvod> poKategoriji(@RequestBody Kategorija kategorija) {
        return service.getByKategorija(kategorija);
    }

    //promjena statusa objave (npr. kad admin odobri)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> izmeniStatus(@PathVariable int id, @RequestParam String noviStatus) {
        try {
            UslugaProizvod u = service.promijeniStatus(id, noviStatus);
            return ResponseEntity.ok(u);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            service.obrisi(id);
            return ResponseEntity.ok("Usluga/Proizvod uspješno obrisan.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
