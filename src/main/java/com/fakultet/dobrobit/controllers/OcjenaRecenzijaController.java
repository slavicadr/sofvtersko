package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.OcjenaRecenzija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KupljenaUsluga;
import com.fakultet.dobrobit.services.OcjenaRecenzijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recenzije")
public class OcjenaRecenzijaController {
    private final OcjenaRecenzijaService service;

    public OcjenaRecenzijaController(OcjenaRecenzijaService service) {
        this.service = service;
    }

    @GetMapping
    public List<OcjenaRecenzija> prikaziSve() {
        return service.getAll();
    }

    //nova recenzija za odredjenu kupovinu
    @PostMapping("/dodaj")
    public ResponseEntity<?> dodaj(@RequestBody OcjenaRecenzija podaci) {
        try {
            // Servis će provjeriti da li recenzija za ovu kupovinu već postoji
            OcjenaRecenzija nova = service.dodajRecenziju(
                    podaci.getKupovina(),
                    podaci.getOcjenjivac(),
                    podaci.getBrojZvjezdica(),
                    podaci.getKomentar()
            );
            return ResponseEntity.ok(nova);
        } catch (RuntimeException e) {
            // Vraća grešku 400 ako se pokuša duplo ocijeniti ista kupovina
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //recenzije od odredjenog korisnika
    @PostMapping("/filter-korisnik")
    public List<OcjenaRecenzija> poKorisniku(@RequestBody Korisnik korisnik) {
        return service.getByKorisnik(korisnik);
    }

    //filtriranje recenzija po broju zvjezdica
    @GetMapping("/ocjena/{broj}")
    public List<OcjenaRecenzija> poBrojuZvjezdica(@PathVariable int broj) {
        return service.getByOcjena(broj);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> obrisi(@PathVariable int id) {
        try {
            service.obrisi(id);
            return ResponseEntity.ok("Recenzija uspješno obrisana.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
