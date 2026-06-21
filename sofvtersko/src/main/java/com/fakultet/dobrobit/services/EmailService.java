package com.fakultet.dobrobit.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void posalji(String na, String naslov, String tekst) {
        CompletableFuture.runAsync(() -> {
            try {
                SimpleMailMessage poruka = new SimpleMailMessage();
                poruka.setFrom("dobrobit2026@outlook.com");
                poruka.setTo(na);
                poruka.setSubject(naslov);
                poruka.setText(tekst);
                mailSender.send(poruka);
            } catch (Exception e) {
                System.err.println("=== EMAIL GREŠKA ===");
                System.err.println("Primatelj: " + na);
                System.err.println("Poruka: " + e.getMessage());
                Throwable cause = e.getCause();
                while (cause != null) {
                    System.err.println("Uzrok: " + cause.getMessage());
                    cause = cause.getCause();
                }
                System.err.println("====================");
            }
        });
    }

    // ── Notifikacije za volontera ─────────────────────────────────────────────

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

    public void posaljiKontaktFormu(String ime, String prezime, String email, String poruka) {
        String naslov = "Dobrobit — Nova poruka: " + ime + " " + prezime;
        String tekst = String.format(
                "Nova poruka primljena putem kontakt forme.\n\n" +
                "Ime i prezime: %s %s\n" +
                "E-mail pošiljaoca: %s\n\n" +
                "Poruka:\n%s\n\n" +
                "---\nDobrobit platforma",
                ime, prezime, email, poruka
        );
        posalji("dobrobit2026@outlook.com", naslov, tekst);
    }

    public void posaljiOdobrenjeUsluge(String email, String ime, String nazivUsluge) {
        String naslov = "Dobrobit — Vaša usluga je odobrena!";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Vaša usluga \"%s\" je odobrena od strane administratora i sada je aktivna na platformi.\n\n" +
                        "Kupci je mogu pronaći i kupiti.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime, nazivUsluge
        );
        posalji(email, naslov, tekst);
    }

    public void posaljiObavjestenjeRealizacije(String email, String ime, String nazivUsluge, boolean jeVolonter) {
        String naslov = "Dobrobit — Usluga označena kao završena";
        String uloga = jeVolonter ? "pružena" : "primljena";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Obavještavamo vas da je usluga \"%s\" uspješno %s i označena kao realizovana.\n\n" +
                        "%s\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                ime, nazivUsluge, uloga,
                jeVolonter
                        ? "Hvala vam na volontiranju! Kupac sada može ostaviti recenziju."
                        : "Sada možete ostaviti recenziju za volontera."
        );
        posalji(email, naslov, tekst);
    }

    public void posaljiOdgovorNaRecenziju(String emailKupca, String imeKupca,
                                           String imeVolontera, String nazivUsluge,
                                           String odgovor) {
        String naslov = "Dobrobit — Volonter je odgovorio na vašu recenziju";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Volonter %s je odgovorio/la na vašu recenziju za uslugu \"%s\".\n\n" +
                        "Odgovor volontera:\n%s\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                imeKupca, imeVolontera, nazivUsluge, odgovor
        );
        posalji(emailKupca, naslov, tekst);
    }

    public void posaljiObavjestenjeKupovineVolonteru(String emailVolontera, String imeVolontera,
                                                      String imeKupca, String emailKupca,
                                                      String nazivUsluge, String iznos) {
        String naslov = "Dobrobit — Neko je kupio vašu uslugu!";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Vaša usluga/proizvod je upravo kupljen.\n\n" +
                        "Usluga: %s\n" +
                        "Iznos: %s KM\n" +
                        "Kupac: %s\n" +
                        "Kontakt kupca: %s\n\n" +
                        "Molimo vas da kontaktirate kupca u najkraćem roku.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                imeVolontera, nazivUsluge, iznos, imeKupca, emailKupca
        );
        posalji(emailVolontera, naslov, tekst);
    }

    public void posaljiObavjestenjeRecenzije(String emailVolontera, String imeVolontera,
                                              String imeKupca, String nazivUsluge,
                                              int ocjena, String komentar) {
        String naslov = "Dobrobit — Nova recenzija za vašu uslugu";
        String tekst = String.format(
                "Poštovani/a %s,\n\n" +
                        "Kupac %s je ostavio/la recenziju za vašu uslugu \"%s\".\n\n" +
                        "Ocjena: %d/5\n" +
                        "Komentar: %s\n\n" +
                        "Sve recenzije možete vidjeti na vašem profilu.\n\n" +
                        "S poštovanjem,\nTim Dobrobit",
                imeVolontera, imeKupca, nazivUsluge, ocjena,
                (komentar != null && !komentar.isBlank()) ? komentar : "(bez komentara)"
        );
        posalji(emailVolontera, naslov, tekst);
    }

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
