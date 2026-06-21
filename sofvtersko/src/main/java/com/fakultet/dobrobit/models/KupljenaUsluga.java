package com.fakultet.dobrobit.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kupljena_usluga")
public class KupljenaUsluga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int kupovinaId;

    @ManyToOne
    @JoinColumn(name = "donator_id", nullable = false)
    private Korisnik donator;

    @ManyToOne
    @JoinColumn(name = "usluga_proizvod_id", nullable = false)
    private UslugaProizvod uslugaProizvod;

    @ManyToOne
    @JoinColumn(name = "pomoc_id", nullable = true)
    private KorisnikPomoci korisnikPomoci;

    private BigDecimal iznos;
    private LocalDateTime datumKupovine = LocalDateTime.now();
    private String statusPlacanja;
    private String nacinPlacanja;
    private String referencaPlacanja;

    @Column(name = "status_isporuke", nullable = false)
    private String statusIsporuke = "na_cekanju";

    private LocalDateTime datumRealizacije;

    public KupljenaUsluga() {}

    public int getKupovinaId() { return kupovinaId; }
    public void setKupovinaId(int kupovinaId) { this.kupovinaId = kupovinaId; }

    public Korisnik getDonator() { return donator; }
    public void setDonator(Korisnik donator) { this.donator = donator; }

    public UslugaProizvod getUslugaProizvod() { return uslugaProizvod; }
    public void setUslugaProizvod(UslugaProizvod uslugaProizvod) { this.uslugaProizvod = uslugaProizvod; }

    public KorisnikPomoci getKorisnikPomoci() { return korisnikPomoci; }
    public void setKorisnikPomoci(KorisnikPomoci korisnikPomoci) { this.korisnikPomoci = korisnikPomoci; }

    public BigDecimal getIznos() { return iznos; }
    public void setIznos(BigDecimal iznos) { this.iznos = iznos; }

    public LocalDateTime getDatumKupovine() { return datumKupovine; }
    public void setDatumKupovine(LocalDateTime datumKupovine) { this.datumKupovine = datumKupovine; }

    public String getStatusPlacanja() { return statusPlacanja; }
    public void setStatusPlacanja(String statusPlacanja) { this.statusPlacanja = statusPlacanja; }

    public String getNacinPlacanja() { return nacinPlacanja; }
    public void setNacinPlacanja(String nacinPlacanja) { this.nacinPlacanja = nacinPlacanja; }

    public String getReferencaPlacanja() { return referencaPlacanja; }
    public void setReferencaPlacanja(String referencaPlacanja) { this.referencaPlacanja = referencaPlacanja; }

    public String getStatusIsporuke() { return statusIsporuke; }
    public void setStatusIsporuke(String statusIsporuke) { this.statusIsporuke = statusIsporuke; }

    public LocalDateTime getDatumRealizacije() { return datumRealizacije; }
    public void setDatumRealizacije(LocalDateTime datumRealizacije) { this.datumRealizacije = datumRealizacije; }
}