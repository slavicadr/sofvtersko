import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { UslugaService } from '../../core/services/usluga.service';
import { KorisnikPomociService } from '../../core/services/korisnik-pomoci.service';
import { KupovinaService } from '../../core/services/kupovina.service';
import { ChatService } from '../../core/services/chat.service';
import { Korisnik, ChatPoruka } from '../../core/models/models';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './volunteer-dashboard.component.html',
  styleUrls: ['./volunteer-dashboard.component.scss']
})
export class VolunteerDashboardComponent implements OnInit, OnDestroy {
  logoPath = 'assets/logoFinally.jpg';
  activeSection = 'overview';
  serviceModalOpen = false;
  editingOffer: any = null;
  hasNotifications = false;

  user: Korisnik | null = null;

  volunteer = {
    firstName: '', lastName: '',
    email: '', phone: '',
    bio: '', avatarUrl: '',
    status: 'PENDING' as 'PENDING' | 'VERIFIED' | 'INACTIVE' | 'SUSPENDED' | 'REMOVED',
  };

  editProfile = { ...this.volunteer };

  stats = { activeOffers: 0, completedServices: 0, avgRating: 0, totalRaised: 0 };

  activeOffers: any[] = [];
  get allOffers() { return this.activeOffers; }

  recentReviews: any[] = [];
  get avgRating(): string {
    if (!this.recentReviews.length) return '0.0';
    const avg = this.recentReviews.reduce((s, r) => s + r.rating, 0) / this.recentReviews.length;
    return avg.toFixed(1);
  }

  beneficiaries: any[] = [];
  myProdaje: any[] = [];

  // Chat
  chatKupovina: any = null;
  chatPoruke: ChatPoruka[] = [];
  novaChatPoruka = '';
  private chatInterval: any = null;

  categories = [
    'Edukacija', 'Zdravlje', 'IT pomoć', 'Astrologija', 'Life-coach',
    'Prevod', 'Proizvodi', 'Pravna pomoć', 'Psihološka podrška', 'Ostalo',
    'NOVA_KATEGORIJA'
  ];

  newCategoryName = '';
  showNewCategory = false;
  newOffer = this.emptyOffer();

  get pendingOffers(): number { return this.activeOffers.filter(o => o.status === 'PENDING').length; }

  constructor(
    private auth: AuthService,
    private uslugaService: UslugaService,
    private pomocService: KorisnikPomociService,
    private kupovinaService: KupovinaService,
    private chatService: ChatService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser;
    if (this.user) {
      this.volunteer = {
        firstName: this.user.ime,
        lastName: this.user.prezime,
        email: this.user.email,
        phone: this.user.telefon ?? '',
        bio: this.user.opis ?? '',
        avatarUrl: '',
        status: this.mapStatus(this.user.statusNaloga),
      };
      this.editProfile = { ...this.volunteer };
      this.loadOffers();
      this.loadProdaje();
      this.loadReviews();
    }
    this.loadBeneficiaries();
  }

  loadOffers() {
    if (!this.user) return;
    this.uslugaService.filterByVolonter(this.user.korisnikId).subscribe({
      next: (data) => {
        this.activeOffers = data.map(u => this.uslugaService.mapToView(u));
        this.stats.activeOffers = this.activeOffers.filter(o => o.status === 'ACTIVE').length;
      }
    });
  }

  loadProdaje() {
    if (!this.user) return;
    this.kupovinaService.getByVolonter(this.user.korisnikId).subscribe({
      next: (data) => {
        this.myProdaje = data.map(k => ({
          id: k.kupovinaId,
          serviceName: k.uslugaProizvod?.naziv ?? '',
          buyerName: k.donator ? `${k.donator.ime} ${k.donator.prezime[0]}.` : 'Anonimno',
          beneficiaryName: k.korisnikPomoci?.naziv ?? '',
          amount: k.iznos,
          date: k.datumKupovine ? new Date(k.datumKupovine).toLocaleDateString('bs-BA') : '',
          statusIsporuke: k.statusIsporuke ?? 'na_cekanju',
          datumRealizacije: k.datumRealizacije ? new Date(k.datumRealizacije).toLocaleDateString('bs-BA') : '',
        }));
        this.stats.completedServices = data.filter(k => k.statusIsporuke === 'realizovano').length;
      }
    });
  }

  loadReviews() {
    if (!this.user) return;
    this.http.get<any[]>(`/api/recenzije/volonter/${this.user.korisnikId}`).subscribe({
      next: (data) => {
        this.recentReviews = data.map(r => {
          const stars = r.brojZvjezdica ?? 0;
          const buyer = r.ocjenjivac ? `${r.ocjenjivac.ime} ${r.ocjenjivac.prezime}` : 'Anonimno';
          return {
            rating: stars,
            starsArray: Array(stars).fill(0),
            emptyStars: Array(5 - stars).fill(0),
            buyerName: buyer,
            buyerInitials: r.ocjenjivac
              ? `${r.ocjenjivac.ime[0]}${r.ocjenjivac.prezime[0]}`
              : '?',
            comment: r.komentar ?? '',
            date: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : '',
            offerName: r.kupovina?.uslugaProizvod?.naziv ?? '',
            reply: '',
            replyOpen: false,
            replyDraft: '',
          };
        });
        if (this.recentReviews.length > 0) {
          const total = this.recentReviews.reduce((s, r) => s + r.rating, 0);
          this.stats.avgRating = Math.round(total / this.recentReviews.length * 10) / 10;
        }
      }
    });
  }

  loadBeneficiaries() {
    this.pomocService.getAll().subscribe({
      next: (data) => {
        this.beneficiaries = data.map(p => ({ id: p.pomocId, name: p.naziv }));
      }
    });
  }

  setSection(s: string) {
    this.activeSection = s;
    if (s !== 'chat') { this.stopChatPolling(); }
  }

  openChat(p: any) {
    this.chatKupovina = p;
    this.activeSection = 'chat';
    this.loadChatPoruke();
    this.startChatPolling();
  }

  loadChatPoruke() {
    if (!this.chatKupovina || !this.user) return;
    this.chatService.getPoruke(this.chatKupovina.id, this.user.korisnikId).subscribe({
      next: (poruke) => { this.chatPoruke = poruke; }
    });
  }

  sendChatPoruka() {
    if (!this.novaChatPoruka.trim() || !this.chatKupovina || !this.user) return;
    this.chatService.posaljiPoruku(this.chatKupovina.id, this.user.korisnikId, this.novaChatPoruka).subscribe({
      next: (p) => { this.chatPoruke.push(p); this.novaChatPoruka = ''; }
    });
  }

  startChatPolling() {
    this.stopChatPolling();
    this.chatInterval = setInterval(() => this.loadChatPoruke(), 5000);
  }

  stopChatPolling() {
    if (this.chatInterval) { clearInterval(this.chatInterval); this.chatInterval = null; }
  }

  ngOnDestroy() { this.stopChatPolling(); }

  getSectionTitle(): string {
    const map: any = {
      overview: 'Pregled', services: 'Moje Ponude', prodaje: 'Moje Prodaje',
      reviews: 'Recenzije', profile: 'Moj Profil', settings: 'Podešavanja',
    };
    return map[this.activeSection] || '';
  }

  getSectionSubtitle(): string {
    const map: any = {
      overview: 'Pregled vašeg profila i aktivnosti',
      services: 'Upravljajte vašim uslugama i proizvodima',
      prodaje: 'Kupovine vaših usluga i status isporuke',
      reviews: 'Recenzije kupaca za vaše usluge',
      profile: 'Uredite vaše podatke i sliku profila',
      settings: 'Podešavanja naloga i pristupačnosti',
    };
    return map[this.activeSection] || '';
  }

  oznaciRealizovano(p: any) {
    if (!confirm(`Označiti "${p.serviceName}" kao realizovanu?`)) return;
    this.kupovinaService.oznaciRealizovano(p.id).subscribe({
      next: (k) => {
        p.statusIsporuke = k.statusIsporuke;
        p.datumRealizacije = k.datumRealizacije ? new Date(k.datumRealizacije).toLocaleDateString('bs-BA') : '';
        this.stats.completedServices++;
      },
      error: (err) => alert(err?.error ?? 'Greška pri označavanju.')
    });
  }

  getStatusLabel(status: string): string {
    const map: any = { PENDING: 'Na čekanju', VERIFIED: 'Verifikovan', INACTIVE: 'Neaktivan', SUSPENDED: 'Suspendovan', REMOVED: 'Uklonjen' };
    return map[status] || status;
  }

  getStatusMessage(): string {
    const map: any = {
      PENDING:   'Vaš profil je na čekanju verifikacije od strane administratora.',
      SUSPENDED: 'Vaš nalog je privremeno suspendovan. Kontaktirajte podršku.',
      REMOVED:   'Vaš nalog je uklonjen.',
      INACTIVE:  'Vaš profil je trenutno neaktivan.',
    };
    return map[this.volunteer.status] || '';
  }

  getOfferStatusLabel(status: string): string {
    const map: any = { ACTIVE: 'Aktivna', FULL: 'Popunjeno', PENDING: 'Na čekanju', REJECTED: 'Odbijena', REMOVED: 'Uklonjena' };
    return map[status] || status;
  }

  onCategoryChange() {
    this.showNewCategory = this.newOffer.category === 'NOVA_KATEGORIJA';
    if (!this.showNewCategory) this.newCategoryName = '';
  }

  openAddService() {
    this.editingOffer = null;
    this.newOffer = this.emptyOffer();
    this.showNewCategory = false;
    this.newCategoryName = '';
    this.serviceModalOpen = true;
  }

  editOffer(o: any) {
    this.editingOffer = o;
    this.newOffer = { ...o };
    this.showNewCategory = false;
    this.serviceModalOpen = true;
  }

  deleteOffer(o: any) {
    if (!confirm(`Obrisati ponudu "${o.name}"?`)) return;
    this.uslugaService.delete(o.id).subscribe({
      next: () => this.activeOffers = this.activeOffers.filter(x => x.id !== o.id),
      error: (err) => alert(err?.error ?? 'Greška pri brisanju ponude.')
    });
  }

  closeServiceModal() { this.serviceModalOpen = false; }

  saveOffer() {
    if (!this.newOffer.name || !this.newOffer.category || !this.newOffer.price) {
      alert('Popunite sva obavezna polja.');
      return;
    }
    if (this.newOffer.category === 'NOVA_KATEGORIJA') {
      if (!this.newCategoryName.trim()) { alert('Unesite naziv nove kategorije.'); return; }
      this.newOffer.category = this.newCategoryName.trim();
    }

    if (!this.user) return;

    const payload: any = {
      volonter: { korisnikId: this.user.korisnikId },
      kategorija: { naziv: this.newOffer.category },
      naziv: this.newOffer.name,
      opis: this.newOffer.description,
      tip: 'usluga',
      cijena: this.newOffer.price,
    };
    if (this.newOffer.limit && this.newOffer.limit > 0) {
      payload.kapacitet = this.newOffer.limit;
    }

    this.uslugaService.create(payload).subscribe({
      next: (u) => {
        this.activeOffers.push(this.uslugaService.mapToView(u));
        this.serviceModalOpen = false;
        alert('Ponuda poslana administratoru na odobrenje.');
      },
      error: (err) => alert('Greška pri kreiranju ponude: ' + (err?.error || err?.status || ''))
    });
  }

  saveProfile() {
    Object.assign(this.volunteer, this.editProfile);
    alert('Profil sačuvan.');
  }

  confirmDeleteProfile() {
    if (confirm('Da li ste sigurni da želite obrisati profil? Ova akcija je trajna.')) {
      this.auth.logout().subscribe(() => {});
      alert('Profil je obrisan.');
    }
  }

  uploadAvatar() {
    const url = prompt('Putanja do profilne slike:');
    if (url) { this.volunteer.avatarUrl = url; this.editProfile.avatarUrl = url; }
  }

  uploadOfferImage(o: any) {
    const url = prompt(`Putanja do slike za "${o.name}":`);
    if (url) o.imageUrl = url;
  }

  uploadNewOfferImage() {
    const url = prompt('Putanja do slike ponude:');
    if (url) this.newOffer.imageUrl = url;
  }

  submitReply(r: any) {
    if (r.replyDraft.trim()) {
      r.reply = r.replyDraft;
      r.replyOpen = false;
      r.replyDraft = '';
    }
  }

  printCertificate(p: any) {
    const volonterIme = `${this.volunteer.firstName} ${this.volunteer.lastName}`;
    const html = `<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <title>Potvrda o volontiranju – ${volonterIme}</title>
  <style>
    @media print {
      body { margin: 0; background: white; }
      .no-print { display: none !important; }
      .certificate { box-shadow: none; }
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f0f5f2;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 20px 48px;
      min-height: 100vh;
    }
    .print-btn {
      margin-bottom: 20px;
      padding: 11px 28px;
      background: #2d6b55;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-family: inherit;
      cursor: pointer;
      letter-spacing: 0.3px;
    }
    .print-btn:hover { background: #1e4a38; }
    .certificate {
      background: #fff;
      width: 794px;
      max-width: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 32px rgba(0,0,0,0.13);
    }
    .cert-header {
      background: linear-gradient(135deg, #2d6b55 0%, #4a9b6a 60%, #7ab648 100%);
      color: #fff;
      text-align: center;
      padding: 40px 48px 36px;
    }
    .cert-header h1 { margin: 0; font-size: 2.2rem; letter-spacing: 3px; font-weight: 800; }
    .cert-header p  { margin: 7px 0 0; font-size: 0.9rem; opacity: 0.88; letter-spacing: 1px; }
    .cert-body {
      padding: 48px 64px 40px;
      text-align: center;
    }
    .cert-badge {
      display: inline-block;
      background: #eaf5ec;
      color: #2d6b55;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 5px 18px;
      border-radius: 20px;
      margin-bottom: 24px;
      border: 1px solid #c3e6cb;
    }
    .cert-title {
      font-size: 1.55rem;
      font-weight: 800;
      color: #1a3d2b;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 28px;
    }
    .cert-intro { font-size: 1rem; color: #555; margin-bottom: 10px; }
    .cert-name {
      font-size: 2.4rem;
      font-weight: 700;
      color: #2d6b55;
      margin: 8px 0 16px;
      padding-bottom: 14px;
      border-bottom: 2.5px solid #7ab648;
      display: inline-block;
    }
    .cert-service-label { font-size: 0.97rem; color: #666; margin: 22px 0 8px; }
    .cert-service { font-size: 1.35rem; font-weight: 700; color: #1a3d2b; margin-bottom: 18px; }
    .cert-row { font-size: 0.94rem; color: #555; margin: 6px 0; }
    .cert-row strong { color: #2d6b55; }
    .cert-date { font-size: 0.9rem; color: #888; font-style: italic; margin-top: 6px; }
    hr { border: none; border-top: 1px solid #dff0e5; margin: 28px 0; }
    .cert-note { font-size: 0.78rem; color: #bbb; font-style: italic; }
    .cert-footer {
      background: #2d6b55;
      color: rgba(255,255,255,0.82);
      text-align: center;
      padding: 14px;
      font-size: 0.8rem;
      letter-spacing: 0.3px;
    }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">&#128438; Štampaj / Sačuvaj kao PDF</button>
  <div class="certificate">
    <div class="cert-header">
      <h1>DOBROBIT</h1>
      <p>Humanitarna platforma</p>
    </div>
    <div class="cert-body">
      <div class="cert-badge">Zvanična potvrda</div>
      <div class="cert-title">Potvrda o volontiranju</div>
      <p class="cert-intro">Ovom potvrdom se potvrđuje da je volonter</p>
      <div class="cert-name">${volonterIme}</div>
      <p class="cert-service-label">uspješno pružio/la volontersku uslugu:</p>
      <div class="cert-service">${p.serviceName}</div>
      <p class="cert-row">u korist korisnika pomoći: <strong>${p.beneficiaryName}</strong></p>
      <p class="cert-date">Datum realizacije: ${p.datumRealizacije}</p>
      <hr/>
      <p class="cert-note">Ovaj certifikat je automatski generisan od strane Dobrobit platforme.</p>
    </div>
    <div class="cert-footer">dobrobit2026@outlook.com</div>
  </div>
</body>
</html>`;
    const win = window.open('', '_blank', 'width=860,height=680');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  showNotifications() {
    alert('Nemate novih obavještenja.');
    this.hasNotifications = false;
  }

  private mapStatus(s: string): 'PENDING' | 'VERIFIED' | 'INACTIVE' | 'SUSPENDED' | 'REMOVED' {
    const map: any = {
      na_cekanju: 'PENDING', aktivan: 'VERIFIED',
      suspendovan: 'SUSPENDED', uklonjen: 'REMOVED'
    };
    return map[s] ?? 'INACTIVE';
  }

  private emptyOffer() {
    return { name: '', category: '', price: null as any, description: '', beneficiaryId: '', imageUrl: '', limit: null as any };
  }
}
