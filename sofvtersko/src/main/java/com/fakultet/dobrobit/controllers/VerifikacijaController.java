package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Verifikacija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.services.VerifikacijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifikacije")
public class VerifikacijaController {
    private final VerifikacijaService verifikacijaService;

    public VerifikacijaController(VerifikacijaService verifikacijaService) {
        this.verifikacijaService = verifikacijaService;
    }

    //lista svih verifikacija na admin panelu
    @GetMapping
    public List<Verifikacija> prikaziSve() {
        return verifikacijaService.getAll();
    }

    //kreiranje novog zahtjeva za verifikaciju
    @PostMapping
    public ResponseEntity<Verifikacija> kreirajZahtjev(@RequestBody Verifikacija v) {
        // Servis će postaviti datum i inicijalni status "na_cekanju"
        Verifikacija nova = verifikacijaService.kreiraj(v);
        return ResponseEntity.ok(nova);
    }

    //verifikacije od specificnog admina
    @PostMapping("/filter-admin")
    public List<Verifikacija> poAdministratoru(@RequestBody Korisnik admin) {
        return verifikacijaService.getByAdmin(admin);
    }

    //verifikacije po statusu
    @GetMapping("/status")
    public List<Verifikacija> poStatusu(@RequestParam String status) {
        return verifikacijaService.getByStatus(status);
    }

    //odbijanje ili odobravanje zahtjeva
    @PutMapping("/{id}/obradi")
    public ResponseEntity<?> obradiZahtjev(
            @PathVariable int id,
            @RequestParam String status,
            @RequestParam(required = false) String napomena) {
        try {
            Verifikacija v = verifikacijaService.obradi(id, status, napomena);
            return ResponseEntity.ok(v);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            verifikacijaService.obrisi(id);
            return ResponseEntity.ok("Zapis o verifikaciji obrisan.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
