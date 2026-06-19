package com.fakultet.dobrobit.models;

import jakarta.persistence.*;

@Entity
@Table(name = "partner")
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String naziv;
    private String kratko;

    @Column(columnDefinition = "TEXT")
    private String opis;

    private String website;
    private String kategorija;
    private String logoUrl;
    private String bojaPozadine;
    private Integer redoslijed;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }
    public String getKratko() { return kratko; }
    public void setKratko(String kratko) { this.kratko = kratko; }
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getKategorija() { return kategorija; }
    public void setKategorija(String kategorija) { this.kategorija = kategorija; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getBojaPozadine() { return bojaPozadine; }
    public void setBojaPozadine(String bojaPozadine) { this.bojaPozadine = bojaPozadine; }
    public Integer getRedoslijed() { return redoslijed; }
    public void setRedoslijed(Integer redoslijed) { this.redoslijed = redoslijed; }
}
