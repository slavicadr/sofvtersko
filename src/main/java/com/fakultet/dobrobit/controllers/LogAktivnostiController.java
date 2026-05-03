package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.LogAktivnosti;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import com.fakultet.dobrobit.services.LogAktivnostiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logovi")
@PreAuthorize("hasRole('administrator')")  // Cijeli controller — samo admin (SRS 5.5)
public class LogAktivnostiController {

    private final LogAktivnostiService service;
    private final KorisnikRepository korisnikRepository;

    public LogAktivnostiController(LogAktivnostiService service,
                                   KorisnikRepository korisnikRepository) {
        this.service = service;
        this.korisnikRepository = korisnikRepository;
    }

    // Svi logovi — admin pregled (SRS 5.5)
    @GetMapping
    public List<LogAktivnosti> sviLogovi() {
        return service.getSvi();
    }

    // Statistike za dashboard (SRS 5.1.3)
    @GetMapping("/statistike")
    public Map<String, Long> statistike() {
        return service.getStatistike();
    }

    // Logovi po tipu: LOGIN, LOGOUT, LOGIN_NEUSPIO, SUMNJIVA_AKTIVNOST
    @GetMapping("/tip/{tip}")
    public List<LogAktivnosti> poTipu(@PathVariable String tip) {
        return service.getByTip(tip.toUpperCase());
    }

    // Logovi za određenog korisnika
    @GetMapping("/korisnik/{korisnikId}")
    public ResponseEntity<?> poKorisniku(@PathVariable int korisnikId) {
        Korisnik k = korisnikRepository.findById(korisnikId)
                .orElse(null);
        if (k == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.getByKorisnik(k));
    }
}
