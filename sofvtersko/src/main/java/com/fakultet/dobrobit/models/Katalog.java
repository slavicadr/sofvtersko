package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "katalog")
public class Katalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naslov;

    @Column(columnDefinition = "TEXT")
    private String opis;

    private String pdfUrl;

    private Integer redoslijed;

    private LocalDateTime datumDodavanja;

    @PrePersist
    public void prePersist() {
        if (datumDodavanja == null) datumDodavanja = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNaslov() { return naslov; }
    public void setNaslov(String naslov) { this.naslov = naslov; }
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public Integer getRedoslijed() { return redoslijed; }
    public void setRedoslijed(Integer redoslijed) { this.redoslijed = redoslijed; }
    public LocalDateTime getDatumDodavanja() { return datumDodavanja; }
    public void setDatumDodavanja(LocalDateTime datumDodavanja) { this.datumDodavanja = datumDodavanja; }
}
