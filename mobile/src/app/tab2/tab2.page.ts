import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { UslugaProizvodService } from '../services/usluga-proizvod.service';
import { KategorijaService } from '../services/kategorija.service';
import { OcjenaRecenzijaService } from '../services/ocjena-recenzija.service';
import { KupljenaUslugaService } from '../services/kupljena-usluga.service';
import { KorisnikPomociService } from '../services/korisnik-pomoci.service';
import { AuthService } from '../services/auth.service';
import { UslugaProizvod } from '../models/usluga-proizvod.model';
import { Kategorija } from '../models/kategorija.model';
import { Korisnik } from '../models/korisnik.model';
import { OcjenaRecenzija } from '../models/ocjena-recenzija.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  usluge: UslugaProizvod[] = [];
  filtrirane: UslugaProizvod[] = [];
  kategorije: Kategorija[] = [];
  odabranaKategorija: number | null = null;
  trenutniUpit = '';
  ucitava = true;

  // Detalji usluge
  uslugaOtvorena = false;
  odabranaUsluga: UslugaProizvod | null = null;

  // Profil volontera
  profilOtvoren = false;
  odabraniVolonter: Korisnik | null = null;
  volonterRecenzije: OcjenaRecenzija[] = [];
  volonterUsluge: UslugaProizvod[] = [];
  prosjecnaOcjena = 0;
  ucitavaProfil = false;

  // Plaćanje
  placanjeOtvoreno = false;
  placanjeSent = false;
  private prvoPomocId: number | null = null;

  korisnik: Korisnik | null = null;

  constructor(
    private uslugaSvc: UslugaProizvodService,
    private kategorijaSvc: KategorijaService,
    private recenzijaSvc: OcjenaRecenzijaService,
    private kupljenaUslugaSvc: KupljenaUslugaService,
    private korisnikPomociSvc: KorisnikPomociService,
    private auth: AuthService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => { this.korisnik = u; });
    this.korisnikPomociSvc.getAll().pipe(catchError(() => of([]))).subscribe(lista => {
      if (lista.length > 0) this.prvoPomocId = lista[0].pomocId;
    });
    this.ucitaj();
    const SKRIVENE = ['kucni majstor', 'prevoz', 'hrana', 'kulinarski'];
    this.kategorijaSvc.getAll().subscribe(k => {
      const filtrirane = k.filter(kat => !SKRIVENE.some(s => this.normalizuj(kat.naziv).includes(s)));
      const ostalo = filtrirane.filter(kat => this.normalizuj(kat.naziv) === 'ostalo');
      const ostale = filtrirane.filter(kat => this.normalizuj(kat.naziv) !== 'ostalo');
      this.kategorije = [...ostale, ...ostalo];
    });
  }

  get jeKupac(): boolean { return this.korisnik?.tipKorisnika === 'kupac'; }
  get jeVolonter(): boolean { return this.korisnik?.tipKorisnika === 'volonter'; }

  ucitaj() {
    this.ucitava = true;
    this.uslugaSvc.getAll().subscribe({
      next: (data) => {
        this.usluge = data.filter(u => u.statusObjave === 'aktivna');
        this.filtrirane = this.usluge;
        this.ucitava = false;
      },
      error: () => { this.ucitava = false; },
    });
  }

  onPretraga(event: CustomEvent) {
    this.trenutniUpit = (event.detail.value as string ?? '').trim();
    this.primijeniFilter();
  }

  filterPoKategoriji(idStr: string | null) {
    this.odabranaKategorija = idStr ? Number(idStr) : null;
    this.primijeniFilter();
  }

  private primijeniFilter() {
    const upit = this.normalizuj(this.trenutniUpit);
    this.filtrirane = this.usluge.filter(u => {
      const matchUpit = !upit ||
        this.normalizuj(u.naziv).includes(upit) ||
        this.normalizuj(u.opis ?? '').includes(upit) ||
        this.normalizuj(u.kategorija?.naziv ?? '').includes(upit);
      const matchKat = !this.odabranaKategorija ||
        u.kategorija?.kategorijaId === this.odabranaKategorija;
      return matchUpit && matchKat;
    });
  }

  klikNaUslugu(usluga: UslugaProizvod) {
    this.odabranaUsluga = usluga;
    this.uslugaOtvorena = true;
  }

  zatvoriUslugu() {
    this.uslugaOtvorena = false;
    this.odabranaUsluga = null;
  }

  // ── Profil volontera ──

  otvoriProfilVolontera(volonter: Korisnik) {
    this.odabraniVolonter = volonter;
    this.profilOtvoren = true;
    this.ucitavaProfil = true;
    this.volonterRecenzije = [];
    this.volonterUsluge = [];
    this.prosjecnaOcjena = 0;

    forkJoin({
      recenzije: this.recenzijaSvc.getByVolonter(volonter.korisnikId),
      prosjek: this.recenzijaSvc.getProsjecnaOcjena(volonter.korisnikId),
      usluge: this.uslugaSvc.getByVolonter(volonter)
    }).subscribe({
      next: (res) => {
        this.volonterRecenzije = res.recenzije;
        this.prosjecnaOcjena = res.prosjek.prosjecnaOcjena ?? 0;
        this.volonterUsluge = res.usluge.filter(u =>
          u.uslugaProizvodId !== this.odabranaUsluga?.uslugaProizvodId
        );
        this.ucitavaProfil = false;
      },
      error: () => { this.ucitavaProfil = false; }
    });
  }

  zatvoriProfil() {
    this.profilOtvoren = false;
    this.odabraniVolonter = null;
  }

  // ── Plaćanje ──

  otvoriPlacanje() {
    this.placanjeSent = false;
    this.placanjeOtvoreno = true;
  }

  zatvoriPlacanje() {
    this.placanjeOtvoreno = false;
  }

  async potvrdiPlacanje() {
    if (!this.korisnik || !this.odabranaUsluga || !this.prvoPomocId) return;
    this.placanjeSent = true;
    const naziv = this.odabranaUsluga.naziv;

    this.kupljenaUslugaSvc.kupi(
      this.korisnik.korisnikId,
      this.odabranaUsluga.uslugaProizvodId,
      this.prvoPomocId,
      this.odabranaUsluga.cijena ?? null,
      'KARTICA'
    ).subscribe({
      next: async () => {
        this.placanjeOtvoreno = false;
        this.zatvoriUslugu();
        this.ucitaj();
        const t = await this.toastCtrl.create({
          message: `✓ Kupovina uspješna! Usluga "${naziv}" je rezervisana.`,
          duration: 3500,
          color: 'success',
          position: 'bottom',
        });
        await t.present();
        this.placanjeSent = false;
      },
      error: async () => {
        this.placanjeSent = false;
        const t = await this.toastCtrl.create({
          message: 'Greška pri kupovini. Pokušajte ponovo.',
          duration: 2500,
          color: 'danger',
          position: 'bottom',
        });
        await t.present();
      }
    });
  }

  // ── Pomoćni ──

  get uslugaInicijali(): string {
    const v = this.odabranaUsluga?.volonter;
    if (!v) return '?';
    return (v.ime?.[0] ?? '') + (v.prezime?.[0] ?? '');
  }

  get profilInicijali(): string {
    const v = this.odabraniVolonter;
    if (!v) return '?';
    return (v.ime?.[0] ?? '') + (v.prezime?.[0] ?? '');
  }

  zvjezdicaArray(n: number): number[] {
    return Array.from({ length: Math.round(n) });
  }

  praznihZvjezdica(n: number): number[] {
    return Array.from({ length: 5 - Math.round(n) });
  }

  formatirajDatum(datum?: string): string {
    if (!datum) return '';
    const d = new Date(datum);
    return d.toLocaleDateString('sr-Latn', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private normalizuj(str: string): string {
    return str.toLowerCase()
      .replace(/š/g, 's').replace(/č/g, 'c').replace(/ć/g, 'c')
      .replace(/đ/g, 'd').replace(/ž/g, 'z');
  }
}
