package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "usluga_proizvod")
public class UslugaProizvod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int uslugaProizvodId;

    @ManyToOne
    @JoinColumn(name = "volonter_id", nullable = false)
    private Korisnik volonter;

    @ManyToOne
    @JoinColumn(name = "kategorija_id", nullable = false)
    private Kategorija kategorija;

    private String naziv;
    private String opis;
    private String tip;
    private BigDecimal cijena;
    private String statusObjave;
    private LocalDateTime datumKreiranja = LocalDateTime.now();

    @Column(name = "kapacitet")
    private Integer kapacitet;

    public UslugaProizvod() {}

    public int getUslugaProizvodId() { return uslugaProizvodId; }
    public void setUslugaProizvodId(int uslugaProizvodId) { this.uslugaProizvodId = uslugaProizvodId; }

    public Korisnik getVolonter() { return volonter; }
    public void setVolonter(Korisnik volonter) { this.volonter = volonter; }

    public Kategorija getKategorija() { return kategorija; }
    public void setKategorija(Kategorija kategorija) { this.kategorija = kategorija; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }

    public BigDecimal getCijena() { return cijena; }
    public void setCijena(BigDecimal cijena) { this.cijena = cijena; }

    public String getStatusObjave() { return statusObjave; }
    public void setStatusObjave(String statusObjave) { this.statusObjave = statusObjave; }

    public LocalDateTime getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(LocalDateTime datumKreiranja) { this.datumKreiranja = datumKreiranja; }

    public Integer getKapacitet() { return kapacitet; }
    public void setKapacitet(Integer kapacitet) { this.kapacitet = kapacitet; }
}