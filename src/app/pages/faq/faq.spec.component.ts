import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  openIndex: number | null = null;

  faqs = [
    { q: 'Kako funkcioniše DobroBit?', a: 'DobroBit povezuje ljude koji žele da pomognu sa onima kojima je pomoć potrebna. Pomoć možete pružiti direktnom donacijom ili kupovinom usluga i proizvoda koje nude volonteri, pri čemu sredstva idu direktno korisnicima pomoći.' },
    { q: 'Da li je potrebno da kreiram nalog da bih donirao?', a: 'Ne. Direktne donacije mogu se izvršiti i bez registracije korisničkog naloga.' },
    { q: 'Kome odlazi moj novac?', a: 'Sredstva od donacija i kupovina usluga namijenjenih humanitarnim akcijama uplaćuju se direktno korisnicima pomoći ili u skladu sa pravilima konkretne akcije objavljene na platformi.' },
    { q: 'Da li DobroBit uzima proviziju od donacija?', a: 'Ne. Cilj platforme je da pomoć stigne do onih kojima je najpotrebnija uz maksimalnu transparentnost.' },
    { q: 'Kako mogu postati volonter?', a: 'Potrebno je da kreirate nalog i prijavite se kao volonter. Nakon verifikacije od strane administratora, možete objavljivati svoje usluge ili proizvode.' },
    { q: 'Kako funkcioniše kupovina usluga?', a: 'Kupac bira uslugu koju nudi volonter, vrši online plaćanje, a sredstva se usmjeravaju prema odabranom humanitarnom slučaju ili korisniku pomoći.' },
    { q: 'Da li su humanitarni slučajevi provjereni?', a: 'Da. Svaki zahtjev prolazi proces administrativne provjere prije objavljivanja na platformi.' },
    { q: 'Kako mogu pratiti donacije?', a: 'Sve realizovane donacije prikazuju se kroz javno dostupne evidencije i izvještaje u skladu sa pravilima zaštite privatnosti.' },
    { q: 'Da li su moji podaci sigurni?', a: 'Da. DobroBit koristi savremene sigurnosne mehanizme zaštite podataka, enkripciju komunikacije i sigurne metode elektronskog plaćanja.' },
    { q: 'Mogu li donirati anonimno?', a: 'Da. Korisnici mogu izabrati opciju anonimne donacije.' },
    { q: 'Šta ako primijetim zloupotrebu ili netačne informacije?', a: 'Svaki korisnik može prijaviti sumnjiv sadržaj putem kontakt forme ili prijave administratoru. Sve prijave se razmatraju u najkraćem mogućem roku.' },
    { q: 'Kako mogu kontaktirati tim DobroBit platforme?', a: 'Putem kontakt forme, e-mail adrese ili drugih kontakt podataka objavljenih na stranici Kontakt.' },
    { q: 'Da li je korišćenje platforme besplatno?', a: 'Da. Registracija korisničkog naloga i pregled sadržaja na platformi su besplatni.' },
    { q: 'Da li mogu obrisati svoj nalog?', a: 'Da. Korisnik u svakom trenutku može zatražiti brisanje naloga i svojih podataka u skladu sa Politikom privatnosti.' },
    { q: 'Zašto da vjerujem DobroBit platformi?', a: 'DobroBit je zasnovan na principima transparentnosti, sigurnosti, solidarnosti i inkluzije. Naš cilj je da svaka pomoć bude vidljiva, odgovorna i usmjerena onima kojima je zaista potrebna.' },
  ];

  toggle(i: number) {
    this.openIndex = this.openIndex === i ? null : i;
  }
}