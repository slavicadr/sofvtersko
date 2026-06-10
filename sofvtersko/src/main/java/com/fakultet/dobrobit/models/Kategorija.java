package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "kategorija")
public class Kategorija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kategorija_id")
    private int kategorijaId;

    @Column(nullable = false, unique = true, length = 100)
    private String naziv;

    @Column(columnDefinition = "TEXT")
    private String opis;

    // Opciono: Lista svih usluga koje pripadaju ovoj kategoriji
    // @OneToMany(mapped_class = "kategorija")
    // private List<UslugaProizvod> usluge;

    public Kategorija() {}

    public Kategorija(String naziv, String opis) {
        this.naziv = naziv;
        this.opis = opis;
    }

    public int getKategorijaId() {
        return kategorijaId;
    }

    public void setKategorijaId(int kategorijaId) {
        this.kategorijaId = kategorijaId;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }
}