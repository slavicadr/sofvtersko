package com.fakultet.dobrobit.models;

import java.time.LocalDateTime;

public class Korisnik {

private  int korisnik_id;
private    String ime;
private    String prezime;
private    String email;
private     String lozinka_hash;
private    String tip_korisnika;
private   String status_naloga;
private String telefon;
private String adresa;
private LocalDateTime datum_registracije;
private boolean verifikovan;
    public Korisnik(int korisnik_id, String ime, String prezime, String email, String lozinka_hash,
                    String telefon, String adresa, String tip_korisnika, String status_naloga,
                    LocalDateTime datum_registracije, boolean verifikovan) {
        this.korisnik_id = korisnik_id;
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.lozinka_hash = lozinka_hash;
        this.telefon = telefon;
        this.adresa = adresa;
        this.tip_korisnika = tip_korisnika;
        this.status_naloga = status_naloga;
        this.datum_registracije = datum_registracije;
        this.verifikovan = verifikovan;
    }

    public int getKorisnik_id() {
        return korisnik_id;
    }

    public void setKorisnik_id(int korisnik_id) {
        this.korisnik_id = korisnik_id;
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

    public String getLozinka_hash() {
        return lozinka_hash;
    }

    public void setLozinka_hash(String lozinka_hash) {
        this.lozinka_hash = lozinka_hash;
    }

    public String getTip_korisnika() {
        return tip_korisnika;
    }

    public void setTip_korisnika(String tip_korisnika) {
        this.tip_korisnika = tip_korisnika;
    }

    public String getStatus_naloga() {
        return status_naloga;
    }

    public void setStatus_naloga(String status_naloga) {
        this.status_naloga = status_naloga;
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

    public LocalDateTime getDatum_registracije() {
        return datum_registracije;
    }

    public void setDatum_registracije(LocalDateTime datum_registracije) {
        this.datum_registracije = datum_registracije;
    }

    public boolean isVerifikovan() {
        return verifikovan;
    }

    public void setVerifikovan(boolean verifikovan) {
        this.verifikovan = verifikovan;
    }
}
