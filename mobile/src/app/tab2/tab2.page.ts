import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UslugaProizvodService } from '../services/usluga-proizvod.service';
import { KategorijaService } from '../services/kategorija.service';
import { OcjenaRecenzijaService } from '../services/ocjena-recenzija.service';
import { UslugaProizvod } from '../models/usluga-proizvod.model';
import { Kategorija } from '../models/kategorija.model';
import { Korisnik } from '../models/korisnik.model';
import { OcjenaRecenzija } from '../models/ocjena-recenzija.model';

const SKRIVENE_KATEGORIJE = ['zdravlje i njega', 'prevoz i transport', 'kućni majstor', 'kucni majstor'];

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

  constructor(
    private uslugaSvc: UslugaProizvodService,
    private kategorijaSvc: KategorijaService,
    private recenzijaSvc: OcjenaRecenzijaService
  ) {}

  ngOnInit() {
    this.ucitaj();
    this.kategorijaSvc.getAll().subscribe(k => {
      const vidljive = k.filter(kat => !SKRIVENE_KATEGORIJE.includes(this.normalizuj(kat.naziv)));
      const ostalo = vidljive.filter(kat => this.normalizuj(kat.naziv) === 'ostalo');
      const ostale = vidljive.filter(kat => this.normalizuj(kat.naziv) !== 'ostalo');
      this.kategorije = [...ostale, ...ostalo];
    });
  }

  ucitaj() {
    this.ucitava = true;
    this.uslugaSvc.getAll().subscribe({
      next: (data) => {
        this.usluge = data.filter(u =>
          !SKRIVENE_KATEGORIJE.includes(this.normalizuj(u.kategorija?.naziv ?? ''))
        );
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

  // Otvori detalje usluge
  klikNaUslugu(usluga: UslugaProizvod) {
    this.odabranaUsluga = usluga;
    this.uslugaOtvorena = true;
  }

  zatvoriUslugu() {
    this.uslugaOtvorena = false;
    this.odabranaUsluga = null;
  }

  // Otvori profil volontera s recenzijama i ostalim uslugama
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
        // Ostale usluge — filtriramo da ne prikazujemo skrivene i onu trenutno otvorenu
        this.volonterUsluge = res.usluge.filter(u =>
          !SKRIVENE_KATEGORIJE.includes(this.normalizuj(u.kategorija?.naziv ?? '')) &&
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
