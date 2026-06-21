package com.fakultet.dobrobit.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final long MAX_SIZE_LOGO = 5 * 1024 * 1024; // 5 MB
    private static final long MAX_SIZE_PDF = 20 * 1024 * 1024; // 20 MB
    private static final java.util.Set<String> DOZVOLJENI_TIPOVI_SLIKE = java.util.Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
    );

    @PostMapping("/logo")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Map<String, String>> uploadLogo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Fajl je prazan."));
        }
        if (file.getSize() > MAX_SIZE_LOGO) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Fajl je prevelik (max 5 MB)."));
        }
        String contentType = file.getContentType();
        if (contentType == null || !DOZVOLJENI_TIPOVI_SLIKE.contains(contentType)) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Dozvoljeni su samo PNG, JPG, GIF, WebP i SVG fajlovi."));
        }

        try {
            Path logosDir = Paths.get("uploads", "logos");
            Files.createDirectories(logosDir);

            String originalFilename = file.getOriginalFilename();
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID() + ext;
            Path destination = logosDir.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/logos/" + filename;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("greska", "Greška pri čuvanju fajla: " + e.getMessage()));
        }
    }

    @PostMapping("/katalog")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Map<String, String>> uploadKatalog(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Fajl je prazan."));
        }
        if (file.getSize() > MAX_SIZE_PDF) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Fajl je prevelik (max 20 MB)."));
        }
        String contentType = file.getContentType();
        if (!"application/pdf".equals(contentType)) {
            return ResponseEntity.badRequest().body(Map.of("greska", "Dozvoljeni su samo PDF fajlovi."));
        }

        try {
            Path katalogDir = Paths.get("uploads", "katalozi");
            Files.createDirectories(katalogDir);

            String originalFilename = file.getOriginalFilename();
            String safeName = (originalFilename != null)
                    ? originalFilename.replaceAll("[^a-zA-Z0-9.\\-_]", "_")
                    : "katalog.pdf";
            String filename = UUID.randomUUID() + "_" + safeName;
            Path destination = katalogDir.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/katalozi/" + filename;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("greska", "Greška pri čuvanju fajla: " + e.getMessage()));
        }
    }
}
