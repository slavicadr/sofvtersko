package com.fakultet.dobrobit.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Generalna metoda za slanje emaila
    private void posalji(String na, String naslov, String tekst) {
        try {
            SimpleMailMessage poruka = new SimpleMailMessage();
            poruka.setFrom("dobrobit2026@outlook.com");
            poruka.setTo(na);
            poruka.setSubject(naslov);
            poruka.setText(tekst);
            mailSender.send(poruka);
        } catch (Exception e) {
            // Ne blokiramo sistem ako email ne stigne — samo logujemo
            System.err.println("Email nije poslan na " + na + ": " + e.getMessage());
        }
    }

    // ── Notifikacije za volontera ─────────────────────────────────────────────

    // Obavještenje pri promjeni statusa naloga (SRS 5.3.1)
    public void posaljiPromjenuStatusa(String email, String ime,
                                       String noviStatus, String razlog) {
        String naslov = "Dobrobit — Promjena statusa vašeg naloga";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Obavještavamo vas da je status vašeg naloga na platformi Dobrobit promijenjen.\n\n" +
                        "Novi status: %s\n" +
                        "Razlog: %s\n\n" +
                        "Ukoliko smatrate da je ovo greška, kontaktirajte nas.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime, noviStatus, razlog
        );
        posalji(email, naslov, tekst);
    }

    // Obavještenje pri uspješnoj registraciji volontera (čeka verifikaciju)
    public void posaljiPotvrduRegistracije(String email, String ime) {
        String naslov = "Dobrobit — Zahtjev za registraciju primljen";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Vaš zahtjev za registraciju na platformi Dobrobit je primljen i čeka verifikaciju.\n\n" +
                        "Administratori će pregledati vaš profil i usluge u najkraćem roku.\n" +
                        "Bićete obaviješteni čim vaš nalog bude odobren.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime
        );
        posalji(email, naslov, tekst);
    }

    // Obavještenje pri odobravanju naloga
    public void posaljiOdobrenjeNaloga(String email, String ime) {
        String naslov = "Dobrobit — Vaš nalog je odobren!";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Drago nam je da vam saopštimo da je vaš nalog na platformi Dobrobit odobren.\n\n" +
                        "Sada možete pristupiti sistemu i početi nuditi vaše usluge.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime
        );
        posalji(email, naslov, tekst);
    }

    // Obavještenje kupcu nakon kupovine (SRS 7.4)
    public void posaljiPotvrdaKupovine(String email, String ime,
                                       String usluga, String volonterKontakt) {
        String naslov = "Dobrobit — Potvrda kupovine";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Vaša kupovina je uspješno obrađena.\n\n" +
                        "Kupljena usluga/proizvod: %s\n" +
                        "Kontakt volontera: %s\n\n" +
                        "Napomena: Platforma ne garantuje izvršenje usluge i ne vraća sredstva.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime, usluga, volonterKontakt
        );
        posalji(email, naslov, tekst);
    }

    // Obavještenje donatoru nakon donacije (SRS 7.4)
    public void posaljiPotvrdaDonacije(String email, String ime, String iznos) {
        String naslov = "Dobrobit — Potvrda donacije";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Hvala vam na vašoj donaciji u iznosu od %s KM.\n\n" +
                        "Vaša donacija je uspješno proslijeđena korisniku pomoći.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime, iznos
        );
        posalji(email, naslov, tekst);
    }
}
