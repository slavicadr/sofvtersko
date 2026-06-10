package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donacija")
public class Donacija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donacija_id")
    private int donacijaId;

    @ManyToOne
    @JoinColumn(name = "donator_id", nullable = true)
    private Korisnik donator;

    @ManyToOne
    @JoinColumn(name = "pomoc_id", nullable = false)
    private KorisnikPomoci korisnikPomoci;

    @Column(nullable = false)
    private BigDecimal iznos;

    @Column(name = "status_donacije")
    private String statusDonacije;

    @Column(name = "status_placanja")
    private String statusPlacanja;

    @Column(name = "nacin_placanja")
    private String nacinPlacanja;

    @Column(name = "referenca_placanja")
    private String referencaPlacanja;

    @Column(name = "datum_donacije")
    private LocalDateTime datumDonacije = LocalDateTime.now();

    @Column(nullable = false)
    private boolean anonimno = false;

    public Donacija() {}

    public int getDonacijaId() { return donacijaId; }
    public void setDonacijaId(int donacijaId) { this.donacijaId = donacijaId; }

    public Korisnik getDonator() { return donator; }
    public void setDonator(Korisnik donator) { this.donator = donator; }

    public KorisnikPomoci getKorisnikPomoci() { return korisnikPomoci; }
    public void setKorisnikPomoci(KorisnikPomoci korisnikPomoci) { this.korisnikPomoci = korisnikPomoci; }

    public BigDecimal getIznos() { return iznos; }
    public void setIznos(BigDecimal iznos) { this.iznos = iznos; }

    public String getStatusDonacije() { return statusDonacije; }
    public void setStatusDonacije(String statusDonacije) { this.statusDonacije = statusDonacije; }

    public String getStatusPlacanja() { return statusPlacanja; }
    public void setStatusPlacanja(String statusPlacanja) { this.statusPlacanja = statusPlacanja; }

    public String getNacinPlacanja() { return nacinPlacanja; }
    public void setNacinPlacanja(String nacinPlacanja) { this.nacinPlacanja = nacinPlacanja; }

    public String getReferencaPlacanja() { return referencaPlacanja; }
    public void setReferencaPlacanja(String referencaPlacanja) { this.referencaPlacanja = referencaPlacanja; }

    public LocalDateTime getDatumDonacije() { return datumDonacije; }
    public void setDatumDonacije(LocalDateTime datumDonacije) { this.datumDonacije = datumDonacije; }

    public boolean isAnonimno() { return anonimno; }
    public void setAnonimno(boolean anonimno) { this.anonimno = anonimno; }
}