package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.models.UslugaProizvod;
import com.fakultet.dobrobit.services.KupljenaUslugaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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

    //kreira se kupovina
    @PostMapping("/kupi")
    public ResponseEntity<?> kupi(
            @RequestBody KupljenaUsluga podaci) {
        try {
            // Pozivamo servis sa svim potrebnim objektima koje smo dobili u Body-u
            KupljenaUsluga novaKupovina = service.kupiUslugu(
                    podaci.getDonator(),
                    podaci.getUslugaProizvod(),
                    podaci.getKorisnikPomoci(),
                    podaci.getIznos(),
                    podaci.getNacinPlacanja()
            );
            return ResponseEntity.ok(novaKupovina);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //pristup kupovini za specificnog donatora
    @PostMapping("/filter-donator")
    public List<KupljenaUsluga> poDonatoru(@RequestBody Korisnik donator) {
        return service.getByDonator(donator);
    }

    //izmjena statusa placanja
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> izmijeniStatus(@PathVariable int id, @RequestParam String noviStatus) {
        try {
            KupljenaUsluga k = service.promijeniStatus(id, noviStatus);
            return ResponseEntity.ok(k);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            service.obrisi(id);
            return ResponseEntity.ok("Zapis o kupovini obrisan.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
