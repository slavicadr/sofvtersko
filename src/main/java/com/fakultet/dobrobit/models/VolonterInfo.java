package com.fakultet.dobrobit.models;

import jakarta.persistence.*;

@Entity
@Table(name = "volonter_info")
public class VolonterInfo {

    @Id
    @Column(name = "volonter_id")
    private int volonterId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "volonter_id")
    private Korisnik korisnik;

    @Column(columnDefinition = "TEXT")
    private String biografija;

    @Column(name = "broj_usluga")
    private int brojUsluga = 0;

    @Column(name = "portfolio_link")
    private String portfolioLink;

    public VolonterInfo() {}

    public int getVolonterId() { return volonterId; }
    public void setVolonterId(int volonterId) { this.volonterId = volonterId; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public String getBiografija() { return biografija; }
    public void setBiografija(String biografija) { this.biografija = biografija; }

    public int getBrojUsluga() { return brojUsluga; }
    public void setBrojUsluga(int brojUsluga) { this.brojUsluga = brojUsluga; }

    public String getPortfolioLink() { return portfolioLink; }
    public void setPortfolioLink(String portfolioLink) { this.portfolioLink = portfolioLink; }
}