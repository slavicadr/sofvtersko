import { Component, OnInit } from '@angular/core';
import { UslugaProizvodService } from '../services/usluga-proizvod.service';
import { KategorijaService } from '../services/kategorija.service';
import { UslugaProizvod } from '../models/usluga-proizvod.model';
import { Kategorija } from '../models/kategorija.model';

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
  ucitava = true;

  constructor(
    private uslugaSvc: UslugaProizvodService,
    private kategorijaSvc: KategorijaService
  ) {}

  ngOnInit() {
    this.ucitaj();
    this.kategorijaSvc.getAll().subscribe(k => this.kategorije = k);
  }

  ucitaj() {
    this.ucitava = true;
    this.uslugaSvc.getAll().subscribe({
      next: (data) => {
        this.usluge = data;
        this.filtrirane = data;
        this.ucitava = false;
      },
      error: () => { this.ucitava = false; },
    });
  }

  onPretraga(event: CustomEvent) {
    const upit = (event.detail.value as string).toLowerCase().trim();
    this.primijeniFilter(upit, this.odabranaKategorija);
  }

  filterPoKategoriji(idStr: string | null) {
    this.odabranaKategorija = idStr ? Number(idStr) : null;
    this.primijeniFilter('', this.odabranaKategorija);
  }

  private primijeniFilter(upit: string, katId: number | null) {
    this.filtrirane = this.usluge.filter(u => {
      const matchUpit = !upit ||
        u.naziv.toLowerCase().includes(upit) ||
        u.opis?.toLowerCase().includes(upit);
      const matchKat = !katId || u.kategorija?.kategorijaId === katId;
      return matchUpit && matchKat;
    });
  }
}
