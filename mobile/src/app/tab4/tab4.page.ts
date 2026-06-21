import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PomogliSlucajService, PomogliSlucaj, Katalog } from '../services/pomogli-slucaj.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  slucajevi: PomogliSlucaj[] = [];
  katalozi: Katalog[] = [];
  ucitava = true;

  otvoreniSlucaj: PomogliSlucaj | null = null;

  constructor(private svc: PomogliSlucajService) {}

  ngOnInit() {
    this.ucitaj();
  }

  ucitaj() {
    this.ucitava = true;
    forkJoin({
      slucajevi: this.svc.getSlucajevi(),
      katalozi: this.svc.getKataloge()
    }).subscribe({
      next: (res) => {
        this.slucajevi = res.slucajevi;
        this.katalozi = res.katalozi;
        this.ucitava = false;
      },
      error: () => { this.ucitava = false; }
    });
  }

  otvoriSlucaj(s: PomogliSlucaj) {
    this.otvoreniSlucaj = this.otvoreniSlucaj?.id === s.id ? null : s;
  }

  zatvoriSlucaj() {
    this.otvoreniSlucaj = null;
  }

  pdfUrl(katalog: Katalog): string {
    const base = 'http://localhost:8080';
    const url = katalog.pdfUrl;
    return url.startsWith('http') ? url : `${base}${url}`;
  }
}
