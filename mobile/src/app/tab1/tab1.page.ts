import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KorisnikPomociService } from '../services/korisnik-pomoci.service';
import { DonacijaService } from '../services/donacija.service';
import { ModalController } from '@ionic/angular';
import { KorisnikPomoci } from '../models/korisnik-pomoci.model';
import { DocModalComponent } from '../shared/doc-modal/doc-modal.component';
import { environment } from '../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  currentYear = new Date().getFullYear();
  ucitava = true;

  aktivniSlucajevi: any[] = [];

  caseColors   = ['#a8ddd0', '#b8e080', '#f0c89e'];
  caseTagBg    = ['rgba(168,221,208,0.35)', 'rgba(184,224,128,0.35)', 'rgba(240,200,158,0.35)'];
  caseTagColor = ['#2d6b55', '#4a6e1a', '#8a5a2a'];

  stats = [
    { value: '...', label: 'Aktivnih volontera' },
    { value: '...', label: 'Humanitarnih slučajeva' },
    { value: '...', label: 'Transakcija' },
    { value: '98%', label: 'Zadovoljnih' },
  ];
  ukupnoDonirano = 0;

  steps = [
    {
      icon: 'search-outline',
      iconBg: 'linear-gradient(135deg,#c8ede4,#a8ddd0)',
      title: 'Pronađi slučaj ili uslugu',
      desc: 'Pregledajte aktivne usluge koje nude volonteri.'
    },
    {
      icon: 'card-outline',
      iconBg: 'linear-gradient(135deg,#d4f09a,#b8e080)',
      title: 'Izvrši donaciju ili kupovinu',
      desc: 'Direktno donirajte novac ili kupite uslugu od volontera.'
    },
    {
      icon: 'chatbubble-heart-outline',
      iconBg: 'linear-gradient(135deg,#fce0c0,#f0c89e)',
      title: 'Ostavi recenziju',
      desc: 'Nakon kupljene usluge ostavite ocjenu i komentar.'
    },
  ];

  roles = [
    {
      icon: 'people-outline',
      iconBg: 'linear-gradient(135deg,#c8ede4,#a8ddd0)',
      title: 'Volonter',
      desc: 'Ponudite uslugu ili proizvod i pomozite nekome u potrebi.'
    },
    {
      icon: 'cart-outline',
      iconBg: 'linear-gradient(135deg,#d4f09a,#b8e080)',
      title: 'Kupac',
      desc: 'Kupite usluge volontera — novac ide direktno korisniku pomoći.'
    },
    {
      icon: 'heart-outline',
      iconBg: 'linear-gradient(135deg,#fce0c0,#f0c89e)',
      title: 'Donator',
      desc: 'Direktno donirajte bez kreiranja naloga — brzo i jednostavno.'
    },
    {
      icon: 'star-outline',
      iconBg: 'linear-gradient(135deg,#d4f09a,#c8ede4)',
      title: 'Korisnik pomoći',
      desc: 'Lice ili organizacija kojoj je pomoć potrebna.'
    },
  ];

  reviews = [
    { initials: 'SK', text: 'Profesionalne i zanimljive lekcije. Marko je odličan predavač!', name: 'Srđan Kadić', service: 'Online Lekcije' },
    { initials: 'AK', text: 'Isplativo online savjetovanje — preporučujem svima.', name: 'Aleksa Kovačević', service: 'Online Konsalting' },
    { initials: 'NP', text: 'Sjajan osjećaj kada znam da moje kupovine direktno pomažu nekome.', name: 'Nina Perović', service: 'Popravka kućanstva' },
  ];

  volStats = [
    { value: '128', label: 'Volontera' },
    { value: '4.8', label: 'Prosj. ocjena' },
    { value: '45',  label: 'Aktiv. ponuda' },
  ];

  donatori = [
    { naziv: 'Evropska Unija', kratko: 'EU',  boja: 'linear-gradient(135deg,#003399,#0052cc)', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png' },
    { naziv: 'ICT Cortex',     kratko: 'ICT', boja: 'linear-gradient(135deg,#1a1a2e,#16213e)', logoUrl: 'https://logo.clearbit.com/ictcortex.me' },
    { naziv: 'UNDP',           kratko: 'UN',  boja: 'linear-gradient(135deg,#0077b6,#00b4d8)', logoUrl: 'https://logo.clearbit.com/undp.org' },
    { naziv: 'Mtel',           kratko: 'MT',  boja: 'linear-gradient(135deg,#cc0000,#ff3333)', logoUrl: 'https://logo.clearbit.com/mtel.me' },
    { naziv: 'TRAG Fondacija', kratko: 'TF',  boja: 'linear-gradient(135deg,#e67e22,#f39c12)', logoUrl: 'https://logo.clearbit.com/tragfondacija.org' },
    { naziv: 'CEMI',           kratko: 'CE',  boja: 'linear-gradient(135deg,#8e44ad,#9b59b6)', logoUrl: 'https://logo.clearbit.com/cemi.org.me' },
  ];

  constructor(
    private korisnikPomociSvc: KorisnikPomociService,
    private donacijaSvc: DonacijaService,
    private router: Router,
    private modalCtrl: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.ucitajSlucajeve();
    this.ucitajStats();
  }

  ucitajStats() {
    const api = environment.apiUrl;
    forkJoin({
      volonteri: this.http.get<any[]>(`${api}/api/korisnici/tip/volonter`, { withCredentials: true }).pipe(catchError(() => of([]))),
      slucajevi: this.korisnikPomociSvc.getAll().pipe(catchError(() => of([]))),
      donacije:  this.donacijaSvc.getAll().pipe(catchError(() => of([]))),
    }).subscribe(res => {
      this.stats[0].value = res.volonteri.length.toString();
      this.stats[1].value = res.slucajevi.length.toString();
      this.stats[2].value = res.donacije.length.toString();
      this.ukupnoDonirano = res.donacije.reduce((s: number, d: any) => s + (d.iznos ?? 0), 0);
    });
  }

  ucitajSlucajeve() {
    this.ucitava = true;
    this.korisnikPomociSvc.getAll().subscribe({
      next: (data) => {
        const top3 = [...data].sort((a, b) => b.pomocId - a.pomocId).slice(0, 3);
        this.aktivniSlucajevi = top3.map(s => ({ ...s, raised: 0, percent: 0 }));

        this.donacijaSvc.getAll().subscribe({
          next: (donacije) => {
            donacije.forEach(d => {
              const s = this.aktivniSlucajevi.find(c => c.pomocId === d.korisnikPomoci?.pomocId);
              if (s) { s.raised += d.iznos; }
            });
            this.aktivniSlucajevi.forEach(s => {
              s.percent = Math.min(100, Math.round((s.raised / 5000) * 100));
            });
          },
          error: () => {}
        });

        this.ucitava = false;
      },
      error: () => { this.ucitava = false; }
    });
  }

  otvoriDetalj(id: number) {
    this.router.navigate(['/tabs/tab1/detalj', id]);
  }

  scrollToCases() {
    const el = document.getElementById('slucajevi-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  async otvoriDokument(tip: string) {
    const modal = await this.modalCtrl.create({
      component: DocModalComponent,
      componentProps: { tip },
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }

  onLogoError(event: Event, kratko: string) {
    const img = event.target as HTMLImageElement;
    const wrap = img.parentElement!;
    img.style.display = 'none';
    wrap.innerHTML = `<span style="font-size:0.85rem;font-weight:800;color:rgba(255,255,255,0.9);">${kratko}</span>`;
  }
}
