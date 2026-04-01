package com.fakultet.dobrobit.models;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "korisnik")
public class Korisnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int korisnikId;

    private String ime;
    private String prezime;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "lozinka_hash", nullable = false)
    private String lozinkaHash;

    private String telefon;
    private String adresa;

    @Enumerated(EnumType.STRING)
    @Column(name = "tip_korisnika")
    private TipKorisnika tipKorisnika;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_naloga")
    private StatusNaloga statusNaloga;

    @Column(name = "datum_registracije")
    private LocalDateTime datumRegistracije;

    private boolean verifikovan;

    public Korisnik() {}

    public Korisnik(String ime, String prezime, String email, String lozinkaHash,
                    String telefon, String adresa,
                    TipKorisnika tipKorisnika, StatusNaloga statusNaloga,
                    LocalDateTime datumRegistracije, boolean verifikovan) {
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.lozinkaHash = lozinkaHash;
        this.telefon = telefon;
        this.adresa = adresa;
        this.tipKorisnika = tipKorisnika;
        this.statusNaloga = statusNaloga;
        this.datumRegistracije = datumRegistracije;
        this.verifikovan = verifikovan;
    }


    public int getKorisnikId() {
        return korisnikId;
    }

    public void setKorisnikId(int korisnikId) {
        this.korisnikId = korisnikId;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLozinkaHash() {
        return lozinkaHash;
    }

    public void setLozinkaHash(String lozinkaHash) {
        this.lozinkaHash = lozinkaHash;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public TipKorisnika getTipKorisnika() {
        return tipKorisnika;
    }

    public void setTipKorisnika(TipKorisnika tipKorisnika) {
        this.tipKorisnika = tipKorisnika;
    }

    public StatusNaloga getStatusNaloga() {
        return statusNaloga;
    }

    public void setStatusNaloga(StatusNaloga statusNaloga) {
        this.statusNaloga = statusNaloga;
    }

    public LocalDateTime getDatumRegistracije() {
        return datumRegistracije;
    }

    public void setDatumRegistracije(LocalDateTime datumRegistracije) {
        this.datumRegistracije = datumRegistracije;
    }

    public boolean isVerifikovan() {
        return verifikovan;
    }

    public void setVerifikovan(boolean verifikovan) {
        this.verifikovan = verifikovan;
    }
}