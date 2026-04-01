package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "profil")
public class Profil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int profilId;

    @OneToOne
    @JoinColumn(name = "korisnik_id", nullable = false, unique = true)
    private Korisnik korisnik;

    @Column(columnDefinition = "TEXT")
    private String opis;

    private String profilnaSlika;
    private String grad;
    private String portfolioLink;

    @Column(name = "prosjecna_ocjena")
    private BigDecimal prosjecnaOcjena;

    public Profil() {}

    // Getteri i Setteri
    public int getProfilId() { return profilId; }
    public void setProfilId(int profilId) { this.profilId = profilId; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public String getProfilnaSlika() { return profilnaSlika; }
    public void setProfilnaSlika(String profilnaSlika) { this.profilnaSlika = profilnaSlika; }

    public String getGrad() { return grad; }
    public void setGrad(String grad) { this.grad = grad; }

    public String getPortfolioLink() { return portfolioLink; }
    public void setPortfolioLink(String portfolioLink) { this.portfolioLink = portfolioLink; }

    public BigDecimal getProsjecnaOcjena() { return prosjecnaOcjena; }
    public void setProsjecnaOcjena(BigDecimal prosjecnaOcjena) { this.prosjecnaOcjena = prosjecnaOcjena; }
}