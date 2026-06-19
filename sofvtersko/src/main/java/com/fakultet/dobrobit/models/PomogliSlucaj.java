package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pomogli_slucaj")
public class PomogliSlucaj {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naslov;

    @Column(columnDefinition = "TEXT")
    private String tekst;

    private String boja; // "roza1", "roza2", "plava"

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
    public String getTekst() { return tekst; }
    public void setTekst(String tekst) { this.tekst = tekst; }
    public String getBoja() { return boja; }
    public void setBoja(String boja) { this.boja = boja; }
    public Integer getRedoslijed() { return redoslijed; }
    public void setRedoslijed(Integer redoslijed) { this.redoslijed = redoslijed; }
    public LocalDateTime getDatumDodavanja() { return datumDodavanja; }
    public void setDatumDodavanja(LocalDateTime datumDodavanja) { this.datumDodavanja = datumDodavanja; }
}
