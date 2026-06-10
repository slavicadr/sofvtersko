package com.fakultet.dobrobit.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final Path UPLOAD_DIR = Paths.get(
            System.getProperty("user.home"), "dobrobit-uploads", "cv"
    );

    @PostMapping("/cv")
    public ResponseEntity<?> uploadCv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fajl je prazan.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body("Dozvoljeni su samo PDF fajlovi.");
        }
        if (file.getSize() > 15 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Fajl ne smije biti veći od 15 MB.");
        }

        try {
            Files.createDirectories(UPLOAD_DIR);

            String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "cv.pdf";
            String filename = UUID.randomUUID() + "_" + original.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path dest = UPLOAD_DIR.resolve(filename);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
            }

            return ResponseEntity.ok(Map.of("url", "/api/upload/cv/" + filename));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Greška pri čuvanju fajla: " + e.getMessage());
        }
    }

    @GetMapping("/cv/{filename}")
    public ResponseEntity<byte[]> downloadCv(@PathVariable String filename) {
        filename = filename.replaceAll("[^a-zA-Z0-9._\\-]", "");
        Path path = UPLOAD_DIR.resolve(filename);
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] bytes = Files.readAllBytes(path);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .body(bytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
