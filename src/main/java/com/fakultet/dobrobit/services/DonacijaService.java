package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Donacija;
import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.KorisnikPomoci;
import com.fakultet.dobrobit.repositories.DonacijaRepository;
import com.fakultet.dobrobit.repositories.KorisnikPomociRepository;
import com.fakultet.dobrobit.repositories.KorisnikRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonacijaService {

    private final DonacijaRepository donacijaRepository;
    private final KorisnikRepository korisnikRepository;
    private final KorisnikPomociRepository korisnikPomociRepository;

    public DonacijaService(DonacijaRepository donacijaRepository,
                           KorisnikRepository korisnikRepository,
                           KorisnikPomociRepository korisnikPomociRepository) {
        this.donacijaRepository = donacijaRepository;
        this.korisnikRepository = korisnikRepository;
        this.korisnikPomociRepository = korisnikPomociRepository;
    }

    public Donacija kreirajDonaciju(int donatorId, int pomocId, BigDecimal iznos, String nacinPlacanja) {
        Korisnik donator = korisnikRepository.findById(donatorId)
                .orElseThrow(() -> new RuntimeException("Donator sa ID " + donatorId + " ne postoji!"));

        KorisnikPomoci korisnikPomoci = korisnikPomociRepository.findById(pomocId)
                .orElseThrow(() -> new RuntimeException("Korisnik pomoci sa ID " + pomocId + " ne postoji!"));

        Donacija donacija = new Donacija();
        donacija.setDonator(donator);
        donacija.setKorisnikPomoci(korisnikPomoci);
        donacija.setIznos(iznos);
        donacija.setNacinPlacanja(nacinPlacanja);
        donacija.setDatumDonacije(LocalDateTime.now());
        donacija.setStatusDonacije("na_cekanju");
        donacija.setStatusPlacanja("neplaceno");

        return donacijaRepository.save(donacija);
    }

    public List<Donacija> getAllDonacije() {
        return donacijaRepository.findAll();
    }

    public List<Donacija> getDonacijeByDonator(Korisnik donator) {
        return donacijaRepository.findByDonator(donator);
    }

    public List<Donacija> getDonacijeByPomoc(KorisnikPomoci pomoc) {
        return donacijaRepository.findByKorisnikPomoci(pomoc);
    }

    public Donacija promijeniStatusDonacije(int id, String status) {
        Donacija d = donacijaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donacija ne postoji"));
        d.setStatusDonacije(status);
        return donacijaRepository.save(d);
    }
}
