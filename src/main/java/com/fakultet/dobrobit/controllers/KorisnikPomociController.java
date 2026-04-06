package com.fakultet.dobrobit.controllers;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.services.KorisnikPomociService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/korisnici-pomoci")
public class KorisnikPomociController {
    private final KorisnikPomociService korisnikPomociService;

    public KorisnikPomociController(KorisnikPomociService korisnikPomociService) {
        this.korisnikPomociService = korisnikPomociService;
    }

    //pristup korisnicima kojima je potrebna pomoc
    @GetMapping
    public List<KorisnikPomoci> prikaziSve() {
        return korisnikPomociService.getAll();
    }

    //pronalazenje zahtjeva preko id-a
    @GetMapping("/{id}")
    public ResponseEntity<KorisnikPomoci> prikaziPoId(@PathVariable int id) {
        try {
            KorisnikPomoci kp = korisnikPomociService.getById(id);
            return ResponseEntity.ok(kp);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //pretraga po nazivu organizacije ili lica
    @GetMapping("/pretraga")
    public List<KorisnikPomoci> pretraziPoNazivu(@RequestParam String naziv) {
        return korisnikPomociService.pretrazi(naziv);
    }

    //kreiranje profila
    @PostMapping
    public ResponseEntity<?> kreirajNoviZahtjev(@RequestBody KorisnikPomoci kp) {
        try {
            KorisnikPomoci novi = korisnikPomociService.kreiraj(kp);
            return ResponseEntity.ok(novi);
        } catch (RuntimeException e) {
            // Vraća grešku ako korisnik već ima aktivan zahtjev
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //azuriranje podataka o pomoci
    @PutMapping("/{id}")
    public ResponseEntity<?> azurirajZahtjev(@PathVariable int id, @RequestBody KorisnikPomoci noviPodaci) {
        try {
            KorisnikPomoci update = korisnikPomociService.update(id, noviPodaci);
            return ResponseEntity.ok(update);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisiZahtjev(@PathVariable int id) {
        try {
            korisnikPomociService.obrisi(id);
            return ResponseEntity.ok("Zahtjev uspješno obrisan.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
