import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikPomociService } from '../services/korisnik-pomoci.service';
import { KorisnikPomoci } from '../models/korisnik-pomoci.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  slucajevi: KorisnikPomoci[] = [];
  filtrirani: KorisnikPomoci[] = [];
  ucitava = true;

  constructor(
    private korisnikPomociSvc: KorisnikPomociService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.ucitava = true;
    this.korisnikPomociSvc.getAll().subscribe({
      next: (data) => {
        this.slucajevi = data;
        this.filtrirani = data;
        this.ucitava = false;
      },
      error: () => { this.ucitava = false; },
    });
  }

  onPretraga(event: CustomEvent) {
    const upit = (event.detail.value as string).toLowerCase().trim();
    if (!upit) {
      this.filtrirani = this.slucajevi;
      return;
    }
    this.filtrirani = this.slucajevi.filter(s =>
      s.naziv.toLowerCase().includes(upit) ||
      s.opisPotrebe?.toLowerCase().includes(upit)
    );
  }

  otvoriDetalj(id: number) {
    this.router.navigate(['/tabs/tab1/detalj', id]);
  }
}
