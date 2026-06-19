package com.fakultet.dobrobit.controllers;

import com.fakultet.dobrobit.models.Partner;
import com.fakultet.dobrobit.repositories.PartnerRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partneri")
public class PartnerController {

    private final PartnerRepository repo;

    public PartnerController(PartnerRepository repo) {
        this.repo = repo;
    }

    @PostConstruct
    public void seedPartnere() {
        if (repo.count() > 0) return;
        List<Partner> pocetni = List.of(
            partner(1, "Evropska Unija",  "EU",  "Evropska Unija podržava razvoj civilnog društva i humanitarnih inicijativa u regionu Zapadnog Balkana kroz različite programe finansiranja i saradnje.", "https://europa.eu",            "Međunarodna organizacija", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png", "linear-gradient(135deg,#003399,#0052cc)"),
            partner(2, "ICT Cortex",       "ICT", "ICT Cortex je klaster IT kompanija u Crnoj Gori koji promoviše digitalizaciju i inovacije. Podrška Dobrobitu odražava predanost društvenoj odgovornosti tech sektora.",    "https://ictcortex.me",         "Tech klaster",             "https://logo.clearbit.com/ictcortex.me",                                                                            "linear-gradient(135deg,#1a1a2e,#16213e)"),
            partner(3, "UNDP Crna Gora",   "UN",  "Program Ujedinjenih nacija za razvoj (UNDP) podržava projekte koji doprinose smanjenju siromaštva i jačanju inkluzivnih zajednica u Crnoj Gori.",                            "https://www.undp.org/montenegro","Međunarodna organizacija", "https://logo.clearbit.com/undp.org",                                                                                "linear-gradient(135deg,#0077b6,#00b4d8)"),
            partner(4, "Mtel",             "MT",  "Mtel je vodeći mobilni operater koji aktivno podržava digitalni razvoj zajednice i humanitarne projekte u Crnoj Gori.",                                                       "https://www.mtel.me",          "Korporacija",              "https://logo.clearbit.com/mtel.me",                                                                                 "linear-gradient(135deg,#cc0000,#ff3333)"),
            partner(5, "TRAG Fondacija",   "TF",  "TRAG fondacija podržava razvoj lokalnih zajednica i civilnog društva u zemljama Zapadnog Balkana kroz grantove i programe jačanja kapaciteta.",                               "https://www.tragfondacija.org","Fondacija",                 "https://logo.clearbit.com/tragfondacija.org",                                                                        "linear-gradient(135deg,#e67e22,#f39c12)"),
            partner(6, "CEMI",             "CE",  "Centar za monitoring i istraživanje (CEMI) promoviše demokratske vrijednosti, vladavinu prava i transparentnost kroz istraživanje i građansko obrazovanje.",                  "https://www.cemi.org.me",     "Nevladina organizacija",   "https://logo.clearbit.com/cemi.org.me",                                                                              "linear-gradient(135deg,#8e44ad,#9b59b6)")
        );
        repo.saveAll(pocetni);
    }

    private Partner partner(int red, String naziv, String kratko, String opis, String web, String kat, String logo, String boja) {
        Partner p = new Partner();
        p.setRedoslijed(red);
        p.setNaziv(naziv);
        p.setKratko(kratko);
        p.setOpis(opis);
        p.setWebsite(web);
        p.setKategorija(kat);
        p.setLogoUrl(logo);
        p.setBojaPozadine(boja);
        return p;
    }

    @GetMapping
    public List<Partner> getAll() {
        return repo.findAllByOrderByRedoslijedAscIdAsc();
    }

    @PostMapping
    @PreAuthorize("hasRole('administrator')")
    public Partner dodaj(@RequestBody Partner p) {
        return repo.save(p);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Partner> azuriraj(@PathVariable Long id, @RequestBody Partner podaci) {
        return repo.findById(id).map(p -> {
            p.setNaziv(podaci.getNaziv());
            p.setKratko(podaci.getKratko());
            p.setOpis(podaci.getOpis());
            p.setWebsite(podaci.getWebsite());
            p.setKategorija(podaci.getKategorija());
            p.setLogoUrl(podaci.getLogoUrl());
            p.setBojaPozadine(podaci.getBojaPozadine());
            p.setRedoslijed(podaci.getRedoslijed());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public ResponseEntity<Void> obrisi(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
