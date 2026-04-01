package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verifikacija")
public class Verifikacija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int verifikacijaId;

    @ManyToOne
    @JoinColumn(name = "korisnik_id")
    private Korisnik korisnik;

    @ManyToOne
    @JoinColumn(name = "usluga_proizvod_id")
    private UslugaProizvod uslugaProizvod;

    @ManyToOne
    @JoinColumn(name = "administrator_id", nullable = false)
    private Korisnik administrator;

    private String tipVerifikacije;
    private String status;
    private String napomena;
    private LocalDateTime datumVerifikacije = LocalDateTime.now();

    public Verifikacija() {}

    public int getVerifikacijaId() { return verifikacijaId; }
    public void setVerifikacijaId(int verifikacijaId) { this.verifikacijaId = verifikacijaId; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public UslugaProizvod getUslugaProizvod() { return uslugaProizvod; }
    public void setUslugaProizvod(UslugaProizvod uslugaProizvod) { this.uslugaProizvod = uslugaProizvod; }

    public Korisnik getAdministrator() { return administrator; }
    public void setAdministrator(Korisnik administrator) { this.administrator = administrator; }

    public String getTipVerifikacije() { return tipVerifikacije; }
    public void setTipVerifikacije(String tipVerifikacije) { this.tipVerifikacije = tipVerifikacije; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNapomena() { return napomena; }
    public void setNapomena(String napomena) { this.napomena = napomena; }

    public LocalDateTime getDatumVerifikacije() { return datumVerifikacije; }
    public void setDatumVerifikacije(LocalDateTime datumVerifikacije) { this.datumVerifikacije = datumVerifikacije; }
}