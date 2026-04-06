package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Kategorija;
import com.fakultet.dobrobit.services.KategorijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kategorije")
public class KategorijaController {
    private final KategorijaService kategorijaService;

    public KategorijaController(KategorijaService kategorijaService) {
        this.kategorijaService = kategorijaService;
    }

    //pristup svim kategorijama
    @GetMapping
    public List<Kategorija> listajSve() {
        return kategorijaService.getAllKategorije();
    }

    //pretraga po nazivu
    @GetMapping("/pretraga")
    public List<Kategorija> pretrazi(@RequestParam String naziv) {
        return kategorijaService.pretraziKategorije(naziv);
    }

    @PostMapping
    public ResponseEntity<?> dodaj(@RequestBody Kategorija kategorija) {
        try {
            Kategorija nova = kategorijaService.dodajKategoriju(kategorija);
            return ResponseEntity.ok(nova);
        } catch (RuntimeException e) {
            //ako kategorija već postoji, vraća se greška 400
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //azuriranje postojece kategorije
    @PutMapping("/{id}")
    public ResponseEntity<?> azuriraj(@PathVariable int id, @RequestBody Kategorija podaci) {
        try {
            Kategorija update = kategorijaService.updateKategorija(id, podaci);
            return ResponseEntity.ok(update);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> obrisi(@PathVariable int id) {
        try {
            kategorijaService.obrisiKategoriju(id);
            return ResponseEntity.ok("Kategorija uspješno obrisana.");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
