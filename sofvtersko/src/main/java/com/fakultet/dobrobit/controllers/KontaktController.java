package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.services.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/kontakt")
public class KontaktController {

    private final EmailService emailService;

    public KontaktController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> posaljiPoruku(@RequestBody Map<String, String> podaci) {
        String ime     = podaci.getOrDefault("ime", "");
        String prezime = podaci.getOrDefault("prezime", "");
        String email   = podaci.getOrDefault("email", "");
        String poruka  = podaci.getOrDefault("poruka", "");

        if (ime.isBlank() || prezime.isBlank() || email.isBlank() || poruka.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Sva polja su obavezna."));
        }

        emailService.posaljiKontaktFormu(ime, prezime, email, poruka);
        return ResponseEntity.ok(Map.of("poruka", "Vaša poruka je uspješno poslana."));
    }
}
