package com.fakultet.dobrobit.models;

import jakarta.persistence.*;

@Entity
@Table(name = "korisnik_pomoci")
public class KorisnikPomoci {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pomoc_id")
    private int pomocId;

    @OneToOne
    @JoinColumn(name = "korisnik_id", nullable = true, unique = true)
    private Korisnik korisnik;

    @Column(name = "naziv_organizacije_ili_lica", nullable = false)
    private String naziv;

    @Column(name = "opis_potrebe", columnDefinition = "TEXT")
    private String opisPotrebe;

    @Column(name = "broj_racuna", nullable = true)
    private String brojRacuna;

    @Column(name = "dokaz_verifikacije")
    private String dokazVerifikacije;

    @Column(name = "status_slucaja", nullable = false)
    private String statusSlucaja = "aktivan";

    public KorisnikPomoci() {}


    public int getPomocId() { return pomocId; }
    public void setPomocId(int pomocId) { this.pomocId = pomocId; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public String getOpisPotrebe() { return opisPotrebe; }
    public void setOpisPotrebe(String opisPotrebe) { this.opisPotrebe = opisPotrebe; }

    public String getBrojRacuna() { return brojRacuna; }
    public void setBrojRacuna(String brojRacuna) { this.brojRacuna = brojRacuna; }

    public String getDokazVerifikacije() { return dokazVerifikacije; }
    public void setDokazVerifikacije(String dokazVerifikacije) { this.dokazVerifikacije = dokazVerifikacije; }

    public String getStatusSlucaja() { return statusSlucaja; }
    public void setStatusSlucaja(String statusSlucaja) { this.statusSlucaja = statusSlucaja; }
}