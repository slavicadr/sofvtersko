import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const PDF_MAP: Record<string, { naslov: string; fajl: string }> = {
  uslovi:     { naslov: 'Uslovi korišćenja',   fajl: 'uslovi-koriscenja.pdf' },
  privatnost: { naslov: 'Politika privatnosti', fajl: 'politika-privatnosti.pdf' },
  ugovor:     { naslov: 'Pravni ugovor',        fajl: 'pravni.pdf' },
};

const FAQS = [
  { q: 'Kako funkcioniše DobroBit?', a: 'DobroBit povezuje ljude koji žele da pomognu sa onima kojima je pomoć potrebna. Pomoć možete pružiti direktnom donacijom ili kupovinom usluga i proizvoda koje nude volonteri, pri čemu sredstva idu direktno korisnicima pomoći.' },
  { q: 'Da li je potrebno da kreiram nalog da bih donirao?', a: 'Ne. Direktne donacije mogu se izvršiti i bez registracije korisničkog naloga.' },
  { q: 'Kome odlazi moj novac?', a: 'Sredstva od donacija i kupovina usluga namijenjenih humanitarnim akcijama uplaćuju se direktno korisnicima pomoći ili u skladu sa pravilima konkretne akcije objavljene na platformi.' },
  { q: 'Da li DobroBit uzima proviziju od donacija?', a: 'Ne. Cilj platforme je da pomoć stigne do onih kojima je najpotrebnija uz maksimalnu transparentnost.' },
  { q: 'Kako mogu postati volonter?', a: 'Potrebno je da kreirate nalog i prijavite se kao volonter. Nakon verifikacije od strane administratora, možete objavljivati svoje usluge ili proizvode.' },
  { q: 'Kako funkcioniše kupovina usluga?', a: 'Kupac bira uslugu koju nudi volonter, vrši online plaćanje, a sredstva se usmjeravaju prema odabranom humanitarnom slučaju ili korisniku pomoći.' },
  { q: 'Da li su humanitarni slučajevi provjereni?', a: 'Da. Svaki zahtjev prolazi proces administrativne provjere prije objavljivanja na platformi.' },
  { q: 'Da li su moji podaci sigurni?', a: 'Da. DobroBit koristi savremene sigurnosne mehanizme zaštite podataka i enkripciju komunikacije.' },
  { q: 'Mogu li donirati anonimno?', a: 'Da. Korisnici mogu izabrati opciju anonimne donacije.' },
  { q: 'Da li je korišćenje platforme besplatno?', a: 'Da. Registracija korisničkog naloga i pregled sadržaja na platformi su besplatni.' },
  { q: 'Da li mogu obrisati svoj nalog?', a: 'Da. Korisnik u svakom trenutku može zatražiti brisanje naloga i svojih podataka.' },
];

@Component({
  selector: 'app-doc-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="light">
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="preuzmi()" *ngIf="tip !== 'faq'" title="Preuzmi PDF">
            <ion-icon name="download-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="zatvori()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- PDF prikaz -->
      <ng-container *ngIf="tip !== 'faq'">
        <iframe
          [src]="pdfSrc"
          width="100%"
          style="height: calc(100vh - 60px); border: none; display: block;">
        </iframe>
      </ng-container>

      <!-- FAQ -->
      <div class="ion-padding" *ngIf="tip === 'faq'">
        <div *ngFor="let item of faqs; let i = index" class="faq-item">
          <button class="faq-q" (click)="toggle(i)">
            {{ item.q }}
            <ion-icon [name]="otvoren === i ? 'chevron-up-outline' : 'chevron-down-outline'"></ion-icon>
          </button>
          <div class="faq-a" *ngIf="otvoren === i">{{ item.a }}</div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .faq-item { border-bottom: 1px solid #e8f5f1; }
    .faq-q {
      width: 100%; background: none; border: none; text-align: left;
      padding: 14px 0; font-size: 0.95rem; font-weight: 600; color: #2d6b55;
      display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 8px;
    }
    .faq-a { padding: 0 0 14px; font-size: 0.88rem; color: #444; line-height: 1.6; }
  `]
})
export class DocModalComponent {
  @Input() tip: string = 'faq';

  faqs = FAQS;
  otvoren: number | null = null;

  constructor(private modalCtrl: ModalController, private sanitizer: DomSanitizer) {}

  get title(): string {
    if (this.tip === 'faq') return 'Često postavljana pitanja';
    return PDF_MAP[this.tip]?.naslov ?? 'Dokument';
  }

  get pdfSrc(): SafeResourceUrl {
    const fajl = PDF_MAP[this.tip]?.fajl ?? '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(`assets/docs/${fajl}`);
  }

  preuzmi() {
    const fajl = PDF_MAP[this.tip]?.fajl ?? '';
    if (!fajl) return;
    const a = document.createElement('a');
    a.href = `assets/docs/${fajl}`;
    a.download = fajl;
    a.click();
  }

  toggle(i: number) {
    this.otvoren = this.otvoren === i ? null : i;
  }

  zatvori() {
    this.modalCtrl.dismiss();
  }
}
