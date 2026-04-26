package com.fakultet.dobrobit.models;

import com.fakultet.dobrobit.enums.StatusNaloga;
import com.fakultet.dobrobit.enums.TipKorisnika;
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
    private String lozinkaHash;

    private String telefon;
    private String adresa;
    private String naziv;

    // Da li se korisnik prikazuje anonimno u javnoj listi donacija/kupovina (SRS 6.1, 7.3)
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

    // Razlog koji administrator unosi pri promjeni statusa (SRS 5.3.1)
    @Column(name = "razlog_promjene_statusa", columnDefinition = "TEXT")
    private String razlogPromjeneStatusa;

    public Korisnik() {}

    // Vraća ime za javni prikaz — "Anonimno" ili "Ime Prezime" (SRS 7.3 / 7.3.1)
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

    // ===================== Spring Security =====================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + tipKorisnika.name()));
    }

    @Override
    public String getPassword() { return lozinkaHash; }

    @Override
    public String getUsername() { return email; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() {
        // Suspendovan i uklonjen korisnik ne može se ulogovati
        return statusNaloga != StatusNaloga.suspendovan
                && statusNaloga != StatusNaloga.uklonjen;
    }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return verifikovan; }
}
