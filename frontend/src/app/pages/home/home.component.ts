import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { KorisnikPomociService } from '../../core/services/korisnik-pomoci.service';
import { DonacijaService } from '../../core/services/donacija.service';
import { UslugaService } from '../../core/services/usluga.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // ── Logo: putanja je relativna na /assets folder ──────────
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  donationModalOpen = false;
  selectedCase: any = null;
  donationAmount = 10;
  donorDisplay = 'name';
  donationAmounts = [5, 10, 25, 50, 100];

  // A11y panel na početnoj (FAB dugme) — delegira na navbar servis
  a11yPanelOpen = false;

  stats = [
    { value: '128',   label: 'Aktivnih volontera' },
    { value: '45',    label: 'Humanitarnih slučajeva' },
    { value: '1.230', label: 'Izvršenih transakcija' },
    { value: '98%',   label: 'Zadovoljnih korisnika' },
  ];

  activeCases: any[] = [];

  roles = [
    { icon:'🤝', iconBg:'linear-gradient(135deg,var(--mint-to),var(--mint-from))', title:'Volonter', desc:'Ponudite uslugu ili proizvod besplatno', items:['Registrujte profil i dodajte uslugu','Administrator verifikuje Vaš profil','Odaberite korisnika pomoći'] },
    { icon:'🛒', iconBg:'linear-gradient(135deg,var(--lime-to),var(--lime-from))', title:'Kupac', desc:'Kupite usluge ili proizvode od volontra', items:['Kreirajte nalog i pregledajte ponude','Bezbjedno plaćanje karticom','Ostavite recenziju nakon kupovine'] },
    { icon:'💝', iconBg:'linear-gradient(135deg,var(--peach-to),var(--peach-from))', title:'Donator', desc:'Direktno donirajte bez kreiranja naloga - brzo i jednostavno.', items:['Ne treba vam nalog','Odaberite korisnika i iznos','Prikaz u javnoj listi donacija'] },
    { icon:'🌟', iconBg:'linear-gradient(135deg,var(--lime-to),var(--mint-from))', title:'Korisnik pomoći', desc:'Lice ili organizacija kojoj je pomoć potrebna ', items:['Registracija i potpisivanje ugovora','Praćenje primljenih donacija','Zaštita privatnosti'] },
  ];

  reviews = [
    { stars:'★★★★★', initials:'SK', avatarUrl:'', text:'Profesionalne i zanimljive lekcije. Marko je odličan predavač!', name:'Srđan Kadić', service:'Online Lekcije' },
    { stars:'★★★★★', initials:'AK', avatarUrl:'', text:'Isplativo online savjetovanje - preporučujem svima.', name:'Aleksa Kovačević', service:'Online Konsalting' },
    { stars:'★★★★☆', initials:'NP', avatarUrl:'', text:'Sjajan osjećaj kada znam da moje kupovine direktno pomažu nekome.', name:'Nina Perović', service:'Popravka kućanstva' },
  ];

  featuredVolunteers: any[] = [];

  volunteerProfileOpen = false;
  selectedVolunteer: any = null;
  volunteerReviews: any[] = [];
  volunteerReviewsLoading = false;


  aboutValues = [
    { icon:'ph-shield-check', bg:'linear-gradient(135deg,#2d6b55,#3d8c6e)', title:'Povjerenje',desc:'' },
    { icon:'ph-lock-simple', bg:'linear-gradient(135deg,#1565c0,#1976d2)', title:'Sigurnost',desc:'' },
    { icon:'ph-handshake', bg:'linear-gradient(135deg,#7ab648,#5a9e28)', title:'Solidarnost',desc:'' },
    { icon:'ph-person-arms-spread', bg:'linear-gradient(135deg,#e67e22,#d35400)', title:'Inkluzija', desc:'' },
  ];

  teamMembers = [
    { name:'Isidora Mujović', role:'Developer', initials:'IM', bg:'linear-gradient(135deg,#a8ddd0,#c8ede4)' },
    { name:'Slavica Drobnjak', role:'Developer', initials:'SD', bg:'linear-gradient(135deg,#b8e080,#d4f09a)' },
    { name:'Anastasija Bulatović', role:'Developer', initials:'AB', bg:'linear-gradient(135deg,#f0c89e,#fce0c0)' },
  ];

  donatori = [
    { naziv:'Evropska Unija',     kratko:'EU', boja:'linear-gradient(135deg,#003399,#0052cc)', logoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png' },
    { naziv:'ICT Cortex',         kratko:'ICT',boja:'linear-gradient(135deg,#1a1a2e,#16213e)', logoUrl:'https://logo.clearbit.com/ictcortex.me' },
    { naziv:'UNDP Crna Gora',     kratko:'UN', boja:'linear-gradient(135deg,#0077b6,#00b4d8)', logoUrl:'https://logo.clearbit.com/undp.org' },
    { naziv:'Mtel',               kratko:'MT', boja:'linear-gradient(135deg,#cc0000,#ff3333)', logoUrl:'https://logo.clearbit.com/mtel.me' },
    { naziv:'TRAG Fondacija', kratko:'TF', boja:'linear-gradient(135deg,#e67e22,#f39c12)', logoUrl:'https://logo.clearbit.com/tragfondacija.org' },
    { naziv:'CEMI',          kratko:'CE', boja:'linear-gradient(135deg,#8e44ad,#9b59b6)', logoUrl:'https://logo.clearbit.com/cemi.org.me' },
  ];

  onHomeDonatorError(event: Event, boja: string, kratko: string) {
    const img = event.target as HTMLImageElement;
    const wrap = img.parentElement!;
    img.style.display = 'none';
    wrap.style.background = boja;
    wrap.innerHTML = `<span style="font-size:1rem;font-weight:800;color:rgba(255,255,255,0.9);">${kratko}</span>`;
  }

  private bgGradients = [
    'linear-gradient(135deg,var(--mint-to),var(--mint-from))',
    'linear-gradient(135deg,var(--lime-to),var(--lime-from))',
    'linear-gradient(135deg,var(--peach-to),var(--peach-from))',
  ];

  constructor(
    private a11yService: AccessibilityService,
    private router: Router,
    private pomocService: KorisnikPomociService,
    private donacijaService: DonacijaService,
    private uslugaService: UslugaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadCases();
    this.loadVolunteers();
  }
  ngAfterViewInit() { this.initScrollAnimations(); }

  loadCases() {
    this.pomocService.getAll().subscribe({
      next: (cases) => {
        const sorted = [...cases].sort((a, b) => b.pomocId - a.pomocId).slice(0, 3);
        const mapped = sorted.map((p, i) => ({
          id: p.pomocId,
          name: p.naziv,
          description: p.opisPotrebe?.split('–')[1]?.trim() ?? p.opisPotrebe ?? '',
          fullDesc: p.opisPotrebe ?? '',
          raised: 0,
          goal: 5000,
          percent: 0,
          category: 'Humanitarni slučaj',
          photoUrl: '',
          avatarBg: this.bgGradients[i % 3],
          imgBg: this.bgGradients[i % 3],
          tagBg: ['var(--mint-to)','var(--lime-to)','var(--peach-to)'][i % 3],
          tagColor: ['#2d6b55','#4a6e1a','#8a5a2a'][i % 3],
        }));
        this.activeCases = mapped;
        this.donacijaService.getAll().subscribe({
          next: (donations) => {
            donations.forEach(d => {
              const c = this.activeCases.find(c => c.id === d.korisnikPomoci?.pomocId);
              if (c) { c.raised += d.iznos; }
            });
            this.activeCases.forEach(c => { c.percent = Math.min(100, Math.round((c.raised / c.goal) * 100)); });
          }
        });
      }
    });
  }

  loadVolunteers() {
    const gradients = [
      'linear-gradient(135deg,rgba(168,221,208,0.3),rgba(184,224,128,0.2))',
      'linear-gradient(135deg,rgba(245,220,150,0.3),rgba(220,160,80,0.2))',
      'linear-gradient(135deg,rgba(180,160,220,0.3),rgba(140,100,200,0.2))',
      'linear-gradient(135deg,rgba(200,235,180,0.3),rgba(160,200,240,0.2))',
      'linear-gradient(135deg,rgba(240,180,180,0.3),rgba(200,140,160,0.2))',
    ];
    this.http.get<any[]>('/api/volonter-info/istaknuti?limit=5').subscribe({
      next: (data) => {
        this.featuredVolunteers = data.map((v, i) => ({
          id: v.volonterId,
          name: `${v.ime} ${v.prezime}`,
          initials: (v.ime?.[0] ?? '') + (v.prezime?.[0] ?? ''),
          opis: v.opis ?? '',
          rating: v.avgRating > 0 ? (v.avgRating as number).toFixed(1) : '—',
          reviewsCount: 0,
          photoUrl: '',
          skills: [],
          bgGradient: gradients[i % gradients.length],
          brojUsluga: v.brojUsluga,
        }));
      }
    });
  }

  initScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }

  openVolunteerProfile(v: any) {
    this.selectedVolunteer = v;
    this.volunteerProfileOpen = true;
    this.volunteerReviews = [];
    this.volunteerReviewsLoading = true;

    this.uslugaService.filterByVolonter(v.id).subscribe({
      next: (services) => {
        if (services.length === 0) { this.volunteerReviewsLoading = false; return; }
        let loaded = 0;
        services.forEach(s => {
          this.http.get<any[]>(`/api/recenzije/usluga/${s.uslugaProizvodId}`).subscribe({
            next: (reviews) => {
              this.volunteerReviews.push(...reviews.map(r => ({
                author: r.ocjenjivac ? `${r.ocjenjivac.ime} ${r.ocjenjivac.prezime}` : 'Anonimno',
                stars: r.brojZvjezdica,
                starsDisplay: '★'.repeat(r.brojZvjezdica) + '☆'.repeat(5 - r.brojZvjezdica),
                date: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : '',
                comment: r.komentar ?? '',
                serviceName: s.naziv
              })));
              loaded++;
              if (loaded === services.length) this.volunteerReviewsLoading = false;
            },
            error: () => { loaded++; if (loaded === services.length) this.volunteerReviewsLoading = false; }
          });
        });
      },
      error: () => { this.volunteerReviewsLoading = false; }
    });
  }

  closeVolunteerProfile() { this.volunteerProfileOpen = false; this.selectedVolunteer = null; }

  get volunteerAvgRating(): number {
    if (!this.volunteerReviews.length) return 0;
    return Math.round(this.volunteerReviews.reduce((s, r) => s + r.stars, 0) / this.volunteerReviews.length * 10) / 10;
  }

  openDonation(c: any) { this.selectedCase = c; this.donationAmount = 10; this.donationModalOpen = true; }
  closeDonation() { this.donationModalOpen = false; }
  confirmDonation() {
    if (!this.selectedCase) return;
    this.donationModalOpen = false;
    this.router.navigate(['/placanje'], {
      queryParams: {
        type: 'donation',
        beneficiaryId: this.selectedCase.id,
        beneficiary: this.selectedCase.name,
        amount: this.donationAmount,
        anonymous: this.donorDisplay === 'anon',
      }
    });
  }
}
