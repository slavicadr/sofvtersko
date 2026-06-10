package com.fakultet.dobrobit.models;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "korisnik")
public class Korisnik implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int korisnikId;

    @NotBlank(message = "Ime je obavezno")
    private String ime;

    @NotBlank(message = "Prezime je obavezno")
    private String prezime;

    @Email(message = "Email nije ispravan")
    @NotBlank(message = "Email je obavezan")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Lozinka je obavezna")
    @Column(name = "lozinka_hash", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String lozinkaHash;

    private String telefon;
    private String adresa;
    private String naziv;

    // Osnovni opis / CV
    @Column(columnDefinition = "TEXT")
    private String opis;

    // Transient — prihvata portfolioLink iz JSON-a pri registraciji, ne čuva se u korisnik tabeli
    @Transient
    private String portfolioLinkTemp;

    // Transient — URL ka CV PDF fajlu uploadovanom pri registraciji
    @Transient
    private String cvUrlTemp;

    @Column(name = "prikaz_anonimno", nullable = false)
    private boolean prikazAnonimno = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "tip_korisnika")
    private TipKorisnika tipKorisnika;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_naloga")
    private StatusNaloga statusNaloga;

    @Column(name = "datum_registracije")
    private LocalDateTime datumRegistracije;

    private boolean verifikovan;

    @Column(name = "razlog_promjene_statusa", columnDefinition = "TEXT")
    private String razlogPromjeneStatusa;

    public Korisnik() {}

    @Transient
    public String getJavnoIme() {
        if (prikazAnonimno) return "Anonimno";
        return ime + " " + prezime;
    }

    // ===================== Getteri i Setteri =====================

    public int getKorisnikId() { return korisnikId; }
    public void setKorisnikId(int korisnikId) { this.korisnikId = korisnikId; }

    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }

    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLozinkaHash() { return lozinkaHash; }
    public void setLozinkaHash(String lozinkaHash) { this.lozinkaHash = lozinkaHash; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getAdresa() { return adresa; }
    public void setAdresa(String adresa) { this.adresa = adresa; }

    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public String getPortfolioLinkTemp() { return portfolioLinkTemp; }
    public void setPortfolioLinkTemp(String portfolioLinkTemp) { this.portfolioLinkTemp = portfolioLinkTemp; }

    public String getCvUrlTemp() { return cvUrlTemp; }
    public void setCvUrlTemp(String cvUrlTemp) { this.cvUrlTemp = cvUrlTemp; }

    public boolean isPrikazAnonimno() { return prikazAnonimno; }
    public void setPrikazAnonimno(boolean prikazAnonimno) { this.prikazAnonimno = prikazAnonimno; }

    public TipKorisnika getTipKorisnika() { return tipKorisnika; }
    public void setTipKorisnika(TipKorisnika tipKorisnika) { this.tipKorisnika = tipKorisnika; }

    public StatusNaloga getStatusNaloga() { return statusNaloga; }
    public void setStatusNaloga(StatusNaloga statusNaloga) { this.statusNaloga = statusNaloga; }

    public LocalDateTime getDatumRegistracije() { return datumRegistracije; }
    public void setDatumRegistracije(LocalDateTime datumRegistracije) { this.datumRegistracije = datumRegistracije; }

    public boolean isVerifikovan() { return verifikovan; }
    public void setVerifikovan(boolean verifikovan) { this.verifikovan = verifikovan; }

    public String getRazlogPromjeneStatusa() { return razlogPromjeneStatusa; }
    public void setRazlogPromjeneStatusa(String razlog) { this.razlogPromjeneStatusa = razlog; }

    // ===================== Spring Security — sve ignorisano u JSON-u =====================

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + tipKorisnika.name()));
    }

    @Override
    @JsonIgnore
    public String getPassword() { return lozinkaHash; }

    @Override
    @JsonIgnore
    public String getUsername() { return email; }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return statusNaloga != StatusNaloga.suspendovan
                && statusNaloga != StatusNaloga.uklonjen;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isEnabled() { return verifikovan; }
}
