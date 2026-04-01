package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocjena_recenzija")
public class OcjenaRecenzija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ocjenaId;

    @OneToOne
    @JoinColumn(name = "kupovina_id", nullable = false, unique = true)
    private KupljenaUsluga kupovina;

    @ManyToOne
    @JoinColumn(name = "ocjenjivac_id", nullable = false)
    private Korisnik ocjenjivac;

    private int brojZvjezdica;
    private String komentar;
    private LocalDateTime datumOcjene = LocalDateTime.now();

    public OcjenaRecenzija() {}

    public int getOcjenaId() { return ocjenaId; }
    public void setOcjenaId(int ocjenaId) { this.ocjenaId = ocjenaId; }

    public KupljenaUsluga getKupovina() { return kupovina; }
    public void setKupovina(KupljenaUsluga kupovina) { this.kupovina = kupovina; }

    public Korisnik getOcjenjivac() { return ocjenjivac; }
    public void setOcjenjivac(Korisnik ocjenjivac) { this.ocjenjivac = ocjenjivac; }

    public int getBrojZvjezdica() { return brojZvjezdica; }
    public void setBrojZvjezdica(int brojZvjezdica) { this.brojZvjezdica = brojZvjezdica; }

    public String getKomentar() { return komentar; }
    public void setKomentar(String komentar) { this.komentar = komentar; }

    public LocalDateTime getDatumOcjene() { return datumOcjene; }
    public void setDatumOcjene(LocalDateTime datumOcjene) { this.datumOcjene = datumOcjene; }
}