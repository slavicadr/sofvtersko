package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "log_aktivnosti")
public class LogAktivnosti {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int logId;

    // Korisnik može biti null za neuspješne pokušaje prijave (nema sesije)
    @ManyToOne
    @JoinColumn(name = "korisnik_id")
    private Korisnik korisnik;

    @Column(nullable = false)
    private String tipAktivnosti; // LOGIN, LOGOUT, LOGIN_NEUSPIO, SUMNJIVA_AKTIVNOST

    @Column(nullable = false)
    private LocalDateTime vrijemeAktivnosti;

    private String ipAdresa;

    @Column(columnDefinition = "TEXT")
    private String detalji; // Dodatne informacije (npr. razlog sumnjive aktivnosti)

    public LogAktivnosti() {}

    public LogAktivnosti(Korisnik korisnik, String tipAktivnosti,
                         String ipAdresa, String detalji) {
        this.korisnik = korisnik;
        this.tipAktivnosti = tipAktivnosti;
        this.vrijemeAktivnosti = LocalDateTime.now();
        this.ipAdresa = ipAdresa;
        this.detalji = detalji;
    }

    public int getLogId() { return logId; }
    public void setLogId(int logId) { this.logId = logId; }

    public Korisnik getKorisnik() { return korisnik; }
    public void setKorisnik(Korisnik korisnik) { this.korisnik = korisnik; }

    public String getTipAktivnosti() { return tipAktivnosti; }
    public void setTipAktivnosti(String tipAktivnosti) { this.tipAktivnosti = tipAktivnosti; }

    public LocalDateTime getVrijemeAktivnosti() { return vrijemeAktivnosti; }
    public void setVrijemeAktivnosti(LocalDateTime v) { this.vrijemeAktivnosti = v; }

    public String getIpAdresa() { return ipAdresa; }
    public void setIpAdresa(String ipAdresa) { this.ipAdresa = ipAdresa; }

    public String getDetalji() { return detalji; }
    public void setDetalji(String detalji) { this.detalji = detalji; }
}
