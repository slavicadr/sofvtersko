import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';
import { UslugaService } from '../../core/services/usluga.service';
import { DonacijaService } from '../../core/services/donacija.service';
import { KorisnikPomociService } from '../../core/services/korisnik-pomoci.service';
import { KupovinaService } from '../../core/services/kupovina.service';
import { Korisnik } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';

  activeSection = 'dashboard';
  searchQuery = '';
  sidebarCollapsed = false;

  adminUser: Korisnik | null = null;
  get admin() {
    return {
      name: this.adminUser ? `${this.adminUser.ime} ${this.adminUser.prezime}` : 'Admin',
      avatarUrl: ''
    };
  }

  kpis = [
    { icon: '🤝', phIcon: 'ph-handshake',       label: 'Ukupno Volontera',    value: 0,  iconBg: 'rgba(45,107,85,0.1)',   trend: '',  trendUp: true  },
    { icon: '⏳', phIcon: 'ph-clock-countdown',  label: 'Na Verifikaciji',     value: 0,  iconBg: 'rgba(255,160,60,0.1)',  trend: 'Na čekanju', trendUp: false },
    { icon: '🛠', phIcon: 'ph-toolbox',          label: 'Aktivnih Ponuda',     value: 0,  iconBg: 'rgba(122,182,72,0.1)',  trend: '', trendUp: true  },
    { icon: '💝', phIcon: 'ph-hand-heart',       label: 'Donacija (€)',        value: 0,  iconBg: 'rgba(142,68,173,0.1)',  trend: '',  trendUp: true  },
  ];

  pendingVolunteersList: any[] = [];
  get pendingVolunteers(): number { return this.pendingVolunteersList.length; }

  suspiciousActivities: any[] = [];
  beneficiaries: any[] = [];

  toasts: { id: number; message: string; type: 'success' | 'error' | 'info' }[] = [];
  private toastCounter = 0;
  toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.toastCounter;
    this.toasts.push({ id, message, type });
    setTimeout(() => { this.removeToast(id); }, 3500);
  }
  removeToast(id: number) { this.toasts = this.toasts.filter(t => t.id !== id); }

  volunteerFilter = 'Svi';
  volunteerSearch = '';
  volunteerFilters = [
    { label: 'Svi', value: 'Svi', count: 0 },
    { label: 'Verifikovani', value: 'Verifikovani', count: 0 },
    { label: 'Na Čekanju', value: 'Na Čekanju', count: 0 },
    { label: 'Neaktivni', value: 'Neaktivni', count: 0 },
    { label: 'Suspendovani', value: 'Suspendovani', count: 0 },
  ];

  allVolunteers: any[] = [];

  get filteredVolunteers() {
    let list = this.allVolunteers.filter(v => v.status !== 'REMOVED');
    const map: any = { 'Verifikovani': 'VERIFIED', 'Na Čekanju': 'PENDING', 'Neaktivni': 'INACTIVE', 'Suspendovani': 'SUSPENDED' };
    if (this.volunteerFilter !== 'Svi') list = list.filter(v => v.status === map[this.volunteerFilter]);
    if (this.volunteerSearch) {
      const q = this.volunteerSearch.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
    }
    return list;
  }

  allOffers: any[] = [];
  offerFilter = 'Sve';
  offerSearch = '';

  get filteredOffers() {
    let list = this.allOffers;
    const map: any = { 'Aktivne': 'ACTIVE', 'Na Čekanju': 'PENDING', 'Odbijene': 'REJECTED', 'Uklonjene': 'REMOVED' };
    if (this.offerFilter !== 'Sve') list = list.filter(o => o.status === map[this.offerFilter]);
    if (this.offerSearch) { const q = this.offerSearch.toLowerCase(); list = list.filter(o => o.name.toLowerCase().includes(q)); }
    return list;
  }

  get pendingOffers(): number { return this.allOffers.filter(o => o.status === 'PENDING').length; }
  get kupovineRealizovano(): number { return this.allKupovine.filter(k => k.statusIsporuke === 'realizovano').length; }
  get kupovineUkupnoEur(): number { return this.allKupovine.reduce((s: number, k: any) => s + Number(k.amount), 0); }

  allKupovine: any[] = [];

  donations: any[] = [];
  allTransactions: any[] = [];
  txSearch = '';
  txStatusFilter = '';
  txDateFrom = '';
  txDateTo = '';

  get filteredTransactions() {
    let list = this.allTransactions;
    if (this.txStatusFilter) list = list.filter(t => t.status === this.txStatusFilter);
    if (this.txSearch) {
      const q = this.txSearch.toLowerCase();
      list = list.filter(t => t.id.toLowerCase().includes(q) || t.buyerName.toLowerCase().includes(q));
    }
    return list;
  }

  get txTotal(): number {
    return this.filteredTransactions.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + t.amount, 0);
  }

  activityLogs: any[] = [];
  allReviews: any[] = [];
  systemAlerts = 0;
  systemAlertsList: any[] = [];

  // ── Partneri ─────────────────────────────────────────────────
  adminPartneri: any[] = [];
  partnerModalOpen = false;
  uredivanjePartnera: any = null;
  noviPartner: any = { naziv: '', kratko: '', opis: '', logoUrl: '', website: '', kategorija: '', redoslijed: 1 };
  logoTabMode: 'upload' | 'url' = 'upload';
  logoUploadStatus: '' | 'uploading' | 'done' | 'error' = '';

  // ── Pomogli smo ──────────────────────────────────────────────
  pomogliSlucajevi: any[] = [];
  pomogliModalOpen = false;
  uredivanjeKartice: any = null;
  novaPomogliKartica: any = { naslov: '', tekst: '', boja: 'roza1', redoslijed: 1 };

  statusModalOpen = false;
  statusChangeTarget: any = null;
  newStatus = 'aktivan';
  statusChangeReason = '';

  volunteerDetailOpen = false;
  volunteerDetail: any = null;
  volunteerDetailLoading = false;

  beneficiaryModalOpen = false;
  editingBeneficiary: any = null;
  newBeneficiary: any = { name: '', description: '', status: 'ACTIVE', photoUrl: '' };

  confirmDeleteOpen = false;
  confirmDeleteName = '';
  confirmDeleteTitle = 'Obrisati zapis?';
  private confirmDeleteCallback: (() => void) | null = null;

  inlinePromptOpen = false;
  inlinePromptTitle = '';
  inlinePromptLabel = '';
  inlinePromptValue = '';
  private inlinePromptCallback: ((val: string) => void) | null = null;

  private openConfirmAction(name: string, callback: () => void, title = 'Obrisati zapis?') {
    this.confirmDeleteName = name;
    this.confirmDeleteTitle = title;
    this.confirmDeleteCallback = callback;
    this.confirmDeleteOpen = true;
  }

  private openInlinePrompt(title: string, label: string, callback: (val: string) => void) {
    this.inlinePromptTitle = title;
    this.inlinePromptLabel = label;
    this.inlinePromptValue = '';
    this.inlinePromptCallback = callback;
    this.inlinePromptOpen = true;
  }

  submitInlinePrompt() {
    if (!this.inlinePromptValue.trim()) { this.toast('Polje je obavezno.', 'error'); return; }
    this.inlinePromptOpen = false;
    if (this.inlinePromptCallback) { this.inlinePromptCallback(this.inlinePromptValue); this.inlinePromptCallback = null; }
  }

  constructor(
    private auth: AuthService,
    private adminService: AdminService,
    private uslugaService: UslugaService,
    private donacijaService: DonacijaService,
    private pomocService: KorisnikPomociService,
    private kupovinaService: KupovinaService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.adminUser = this.auth.currentUser;
    this.loadAll();
  }

  loadAll() {
    this.adminService.getAllKorisnici().subscribe({
      next: (korisnici) => {
        const volonteri = korisnici.filter(k => k.tipKorisnika === 'volonter');
        this.allVolunteers = volonteri.map(v => ({
          id: v.korisnikId,
          name: `${v.ime} ${v.prezime}`,
          email: v.email,
          initials: v.ime[0] + v.prezime[0],
          avatarUrl: '',
          servicesCount: 0,
          rating: 0,
          status: this.mapStatus(v.statusNaloga, v.verifikovan),
          joinDate: v.datumRegistracije ? new Date(v.datumRegistracije).toLocaleDateString('bs-BA') : '',
        }));
        this.pendingVolunteersList = this.allVolunteers.filter(v => v.status === 'PENDING');
        this.kpis[0].value = volonteri.length;
        this.kpis[1].value = this.pendingVolunteersList.length;
        this.updateVolunteerFilterCounts();
      }
    });

    this.uslugaService.getAll().subscribe({
      next: (usluge) => {
        this.allOffers = usluge.map(u => ({
          id: u.uslugaProizvodId,
          name: u.naziv,
          volunteerName: u.volonter ? `${u.volonter.ime} ${u.volonter.prezime}` : '',
          category: u.kategorija?.naziv ?? '',
          price: u.cijena,
          status: u.statusObjave === 'aktivna' ? 'ACTIVE' : u.statusObjave === 'popunjeno' ? 'FULL' : u.statusObjave === 'na_cekanju' ? 'PENDING' : 'REJECTED',
          created: '',
          imageUrl: '',
          emoji: ''
        }));
        this.kpis[2].value = this.allOffers.filter(o => o.status === 'ACTIVE').length;
      }
    });

    this.donacijaService.getAll().subscribe({
      next: (donations) => {
        this.donations = donations.map(d => this.donacijaService.mapToView(d));
        const totalDonations = donations.reduce((s, d) => s + Number(d.iznos), 0);

        const donationTx = donations.map(d => ({
          id: 'DON-' + d.donacijaId,
          date: d.datumDonacije ? new Date(d.datumDonacije).toLocaleString('bs-BA') : '',
          buyerName: d.donator?.prikazAnonimno ? 'Anonimno' : `${d.donator?.ime ?? ''} ${d.donator?.prezime ?? ''}`.trim(),
          offer: 'Direktna Donacija',
          beneficiaryName: d.korisnikPomoci?.naziv ?? '',
          amount: Number(d.iznos),
          status: (d.statusDonacije === 'placeno' || d.statusPlacanja === 'placeno') ? 'SUCCESS' : 'PENDING'
        }));

        // Also load purchases to merge into transactions
        this.kupovinaService.getAll().subscribe({
          next: (purchases) => {
            const purchaseTx = purchases.map(k => ({
              id: 'KUP-' + k.kupovinaId,
              date: k.datumKupovine ? new Date(k.datumKupovine).toLocaleString('bs-BA') : '',
              buyerName: k.donator ? `${k.donator.ime} ${k.donator.prezime}`.trim() : 'N/A',
              offer: k.uslugaProizvod?.naziv ?? 'Usluga',
              beneficiaryName: k.korisnikPomoci?.naziv ?? '',
              amount: Number(k.iznos),
              status: k.statusPlacanja === 'placeno' ? 'SUCCESS' : 'PENDING'
            }));
            this.allTransactions = [...donationTx, ...purchaseTx]
              .sort((a, b) => (b.date > a.date ? 1 : -1));
            const totalAll = this.allTransactions.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + t.amount, 0);
            this.kpis[3].value = totalAll;
          }
        });
      }
    });

    this.loadBeneficiaries();

    this.adminService.getLogs().subscribe({
      next: (logs) => {
        this.activityLogs = logs.slice(0, 10).map(l => ({
          type: l.tipAktivnosti === 'LOGIN_NEUSPIO' ? 'warn' : 'info',
          text: `${l.tipAktivnosti} — ${l.detalji ?? l.ipAdresa}`,
          user: l.korisnik ? `${l.korisnik.ime} ${l.korisnik.prezime}` : 'Sistem',
          time: l.vrijemeAktivnosti ? new Date(l.vrijemeAktivnosti).toLocaleTimeString('bs-BA') : '',
          typeLabel: l.tipAktivnosti === 'LOGIN_NEUSPIO' ? 'Upozor.' : 'Info'
        }));
      }
    });

    this.loadAllReviews();
  }

  raisedPercent(b: any): number { return Math.min(100, Math.round((b.raised / b.goal) * 100)); }
  getBeneficiaryStatusLabel(s: string): string { return this.getStatusLabel(s); }
  getVolunteerStatusLabel(s: string): string { return this.getStatusLabel(s); }
  getOfferStatusLabel(s: string): string { return this.getStatusLabel(s); }
  getLogIcon(type: string): string {
    const map: any = { info: 'ph-info', warn: 'ph-warning', error: 'ph-x-circle' };
    return map[type] || 'ph-info';
  }

  approveOffer(o: any) {
    this.uslugaService.updateStatus(o.id, 'aktivna').subscribe({
      next: () => { o.status = 'ACTIVE'; this.toast(`Ponuda "${o.name}" odobrena.`, 'success'); },
      error: () => this.toast('Greška pri odobravanju.', 'error')
    });
  }

  rejectOffer(o: any) {
    this.openInlinePrompt('Odbijanje ponude', 'Razlog odbijanja:', (reason) => {
      this.uslugaService.updateStatus(o.id, 'odbijena').subscribe({
        next: () => { o.status = 'REJECTED'; this.toast('Ponuda odbijena.', 'info'); },
        error: () => this.toast('Greška.', 'error')
      });
    });
  }

  removeOffer(o: any) {
    this.openConfirmAction(`"${o.name}"`, () => {
      this.uslugaService.updateStatus(o.id, 'uklonjena').subscribe({
        next: () => { o.status = 'REMOVED'; this.toast('Ponuda uklonjena.', 'info'); }
      });
    });
  }

  openStatusChange(target: any) {
    this.statusChangeTarget = target;
    const statusMap: any = { VERIFIED: 'aktivan', PENDING: 'na_cekanju', INACTIVE: 'neaktivan', SUSPENDED: 'suspendovan' };
    this.newStatus = statusMap[target.status] ?? 'aktivan';
    this.statusChangeReason = '';
    this.statusModalOpen = true;
  }

  closeStatusModal() { this.statusModalOpen = false; }

  confirmStatusChange() {
    if (!this.statusChangeReason.trim()) { this.toast('Molimo unesite razlog.', 'error'); return; }
    const id = this.statusChangeTarget?.id;
    if (!id) return;
    this.adminService.promijeniStatus(id, this.newStatus, this.statusChangeReason).subscribe({
      next: (k) => {
        const noviStatus = this.mapStatus(k.statusNaloga, k.verifikovan);
        this.allVolunteers = this.allVolunteers.map(v => v.id === id ? { ...v, status: noviStatus } : v);
        this.toast('Status uspješno promijenjen.', 'success');
        this.statusModalOpen = false;
        this.pendingVolunteersList = this.allVolunteers.filter(v => v.status === 'PENDING');
        this.updateVolunteerFilterCounts();
      },
      error: (err) => this.toast('Greška: ' + (err?.error ?? err?.message ?? err?.status ?? 'Nepoznato'), 'error')
    });
  }

  openVolunteerDetail(v: any) {
    this.volunteerDetail = { ...v, biografija: '', portfolioLink: '', cvUrl: '', brojUsluga: 0, services: [] };
    this.volunteerDetailOpen = true;
    this.volunteerDetailLoading = true;
    this.adminService.getVolonterInfo(v.id).subscribe({
      next: (info) => {
        this.volunteerDetail.biografija = info.biografija || 'Nema opisane biografije.';
        this.volunteerDetail.portfolioLink = info.portfolioLink || '';
        this.volunteerDetail.cvUrl = info.cvUrl || '';
        this.volunteerDetail.brojUsluga = info.brojRealizovanihUsluga ?? 0;
        this.volunteerDetailLoading = false;
      },
      error: () => {
        this.volunteerDetail.biografija = 'Biografija nije dostupna.';
        this.volunteerDetailLoading = false;
      }
    });
    this.uslugaService.filterByVolonter(v.id).subscribe({
      next: (usluge) => {
        if (this.volunteerDetail) {
          this.volunteerDetail.services = usluge.map((u: any) => ({
            name: u.naziv,
            category: u.kategorija?.naziv ?? '',
            price: u.cijena,
            status: u.statusObjave === 'aktivna' ? 'ACTIVE'
                  : u.statusObjave === 'popunjeno' ? 'FULL'
                  : u.statusObjave === 'na_cekanju' ? 'PENDING' : 'REJECTED',
          }));
        }
      },
      error: () => {}
    });
  }

  closeVolunteerDetail() { this.volunteerDetailOpen = false; this.volunteerDetail = null; }

  loadAllKupovine() {
    this.kupovinaService.getAll().subscribe({
      next: (data) => {
        this.allKupovine = data.map(k => ({
          id: k.kupovinaId,
          serviceName: k.uslugaProizvod?.naziv ?? '',
          buyerName: k.donator ? `${k.donator.ime} ${k.donator.prezime}` : 'N/A',
          volunteerName: k.uslugaProizvod?.volonter
            ? `${k.uslugaProizvod.volonter.ime} ${k.uslugaProizvod.volonter.prezime}`
            : 'N/A',
          amount: k.iznos,
          date: k.datumKupovine ? new Date(k.datumKupovine).toLocaleDateString('bs-BA') : '',
          statusIsporuke: k.statusIsporuke ?? 'na_cekanju',
          datumRealizacije: k.datumRealizacije ? new Date(k.datumRealizacije).toLocaleDateString('bs-BA') : '',
        }));
      }
    });
  }

  adminOznaciRealizovano(k: any) {
    this.openConfirmAction(`"${k.serviceName}"`, () => {
      this.kupovinaService.oznaciRealizovano(k.id).subscribe({
        next: (updated) => {
          k.statusIsporuke = updated.statusIsporuke;
          k.datumRealizacije = updated.datumRealizacije
            ? new Date(updated.datumRealizacije).toLocaleDateString('bs-BA') : '';
          this.toast('Usluga označena kao realizovana.', 'success');
        },
        error: (err) => this.toast(err?.error ?? 'Greška pri označavanju.', 'error')
      });
    }, 'Označiti kao realizovano?');
  }

  approveVolunteer(v: any) {
    this.adminService.promijeniStatus(v.id, 'aktivan', 'Profil odobren.').subscribe({
      next: () => {
        this.allVolunteers = this.allVolunteers.map(x => x.id === v.id ? { ...x, status: 'VERIFIED' } : x);
        this.pendingVolunteersList = this.allVolunteers.filter(p => p.status === 'PENDING');
        this.updateVolunteerFilterCounts();
        this.toast(`Volonter ${v.name} verifikovan.`, 'success');
      },
      error: () => this.toast('Greška.', 'error')
    });
  }

  rejectVolunteer(v: any) {
    this.openInlinePrompt('Odbijanje volontera', 'Razlog odbijanja:', (reason) => {
      this.adminService.promijeniStatus(v.id, 'suspendovan', reason).subscribe({
        next: () => {
          this.allVolunteers = this.allVolunteers.map(x => x.id === v.id ? { ...x, status: 'REJECTED' } : x);
          this.pendingVolunteersList = this.allVolunteers.filter(p => p.status === 'PENDING');
          this.updateVolunteerFilterCounts();
          this.toast('Verifikacija odbijena.', 'info');
        },
        error: () => this.toast('Greška.', 'error')
      });
    });
  }

  loadAllReviews() {
    this.http.get<any[]>('/api/recenzije').subscribe({
      next: (data) => {
        this.allReviews = data.map(r => ({
          id: r.ocjenaId,
          buyerName: r.ocjenjivac ? `${r.ocjenjivac.ime} ${r.ocjenjivac.prezime}` : 'N/A',
          serviceName: r.kupovina?.uslugaProizvod?.naziv ?? 'N/A',
          volunteerName: r.kupovina?.uslugaProizvod?.volonter
            ? `${r.kupovina.uslugaProizvod.volonter.ime} ${r.kupovina.uslugaProizvod.volonter.prezime}`
            : 'N/A',
          starsDisplay: '★'.repeat(r.brojZvjezdica) + '☆'.repeat(5 - r.brojZvjezdica),
          comment: r.komentar ?? '',
          date: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : '',
        }));
      }
    });
  }

  deleteReview(r: any) {
    this.openConfirmAction('ovu recenziju', () => {
      this.http.delete(`/api/recenzije/${r.id}`, { responseType: 'text' }).subscribe({
        next: () => { this.allReviews = this.allReviews.filter(x => x !== r); this.toast('Recenzija obrisana.', 'success'); },
        error: (err) => this.toast(err?.error ?? 'Greška pri brisanju recenzije.', 'error')
      });
    });
  }

  // ── Partneri ─────────────────────────────────────────────────
  loadPartnere() {
    this.http.get<any[]>('/api/partneri').subscribe({
      next: (data) => { this.adminPartneri = data; }
    });
  }

  otvoriPartnerFormu() {
    this.uredivanjePartnera = null;
    this.noviPartner = { naziv: '', kratko: '', opis: '', logoUrl: '', website: '', kategorija: '', redoslijed: this.adminPartneri.length + 1 };
    this.logoTabMode = 'upload';
    this.logoUploadStatus = '';
    this.partnerModalOpen = true;
  }

  urediPartnera(p: any) {
    this.uredivanjePartnera = p;
    this.noviPartner = { ...p };
    this.logoTabMode = p.logoUrl?.startsWith('/uploads/') ? 'upload' : 'url';
    this.logoUploadStatus = p.logoUrl?.startsWith('/uploads/') ? 'done' : '';
    this.partnerModalOpen = true;
  }

  onLogoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadLogoFile(input.files[0]);
    }
  }

  onLogoDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.uploadLogoFile(file);
  }

  private uploadLogoFile(file: File) {
    this.logoUploadStatus = 'uploading';
    const formData = new FormData();
    formData.append('file', file);
    this.http.post<{ url: string }>('/api/upload/logo', formData).subscribe({
      next: (res) => {
        this.noviPartner.logoUrl = res.url;
        this.logoUploadStatus = 'done';
      },
      error: () => { this.logoUploadStatus = 'error'; }
    });
  }

  sacuvajPartnera() {
    if (!this.noviPartner.naziv?.trim() || !this.noviPartner.logoUrl?.trim()) {
      this.toast('Naziv i logo su obavezni.', 'error'); return;
    }
    if (this.uredivanjePartnera) {
      this.http.put<any>(`/api/partneri/${this.uredivanjePartnera.id}`, this.noviPartner).subscribe({
        next: (updated) => { Object.assign(this.uredivanjePartnera, updated); this.partnerModalOpen = false; this.toast('Partner sačuvan.', 'success'); },
        error: () => this.toast('Greška pri čuvanju.', 'error')
      });
    } else {
      this.http.post<any>('/api/partneri', this.noviPartner).subscribe({
        next: (novi) => { this.adminPartneri.push(novi); this.partnerModalOpen = false; this.toast('Partner dodan.', 'success'); },
        error: () => this.toast('Greška pri dodavanju.', 'error')
      });
    }
  }

  obrisiPartnera(p: any) {
    this.openConfirmAction(`"${p.naziv}"`, () => {
      this.http.delete(`/api/partneri/${p.id}`).subscribe({
        next: () => { this.adminPartneri = this.adminPartneri.filter(x => x.id !== p.id); this.toast('Partner obrisan.', 'success'); },
        error: () => this.toast('Greška pri brisanju.', 'error')
      });
    });
  }

  zatvoriPartnerModal() { this.partnerModalOpen = false; }

  onPartnerLogoError(event: Event, boja: string, kratko: string) {
    const img = event.target as HTMLImageElement;
    const wrap = img.parentElement!;
    img.style.display = 'none';
    wrap.style.background = boja || 'linear-gradient(135deg,#2d6b55,#7ab648)';
    wrap.innerHTML = `<span style="font-size:1rem;font-weight:800;color:rgba(255,255,255,0.9);">${kratko || '?'}</span>`;
  }

  onPreviewError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  // ── Pomogli smo ──────────────────────────────────────────────
  loadPomogliSlucajevi() {
    this.http.get<any[]>('/api/pomogli-slucajevi').subscribe({
      next: (data) => { this.pomogliSlucajevi = data; }
    });
  }

  otvoriPomogliFormu() {
    this.uredivanjeKartice = null;
    this.novaPomogliKartica = { naslov: '', tekst: '', boja: 'roza1', redoslijed: this.pomogliSlucajevi.length + 1 };
    this.pomogliModalOpen = true;
  }

  urediPomogliSlucaj(s: any) {
    this.uredivanjeKartice = s;
    this.novaPomogliKartica = { naslov: s.naslov, tekst: s.tekst, boja: s.boja, redoslijed: s.redoslijed };
    this.pomogliModalOpen = true;
  }

  sacuvajPomogliKarticu() {
    if (!this.novaPomogliKartica.naslov?.trim() || !this.novaPomogliKartica.tekst?.trim()) {
      this.toast('Naslov i tekst su obavezni.', 'error'); return;
    }
    if (this.uredivanjeKartice) {
      this.http.put<any>(`/api/pomogli-slucajevi/${this.uredivanjeKartice.id}`, this.novaPomogliKartica).subscribe({
        next: (updated) => {
          Object.assign(this.uredivanjeKartice, updated);
          this.pomogliModalOpen = false;
          this.toast('Kartica sačuvana.', 'success');
        },
        error: () => this.toast('Greška pri čuvanju.', 'error')
      });
    } else {
      this.http.post<any>('/api/pomogli-slucajevi', this.novaPomogliKartica).subscribe({
        next: (nova) => { this.pomogliSlucajevi.push(nova); this.pomogliModalOpen = false; this.toast('Kartica dodana.', 'success'); },
        error: () => this.toast('Greška pri dodavanju.', 'error')
      });
    }
  }

  obrisiPomogliSlucaj(s: any) {
    this.openConfirmAction(`"${s.naslov}"`, () => {
      this.http.delete(`/api/pomogli-slucajevi/${s.id}`).subscribe({
        next: () => { this.pomogliSlucajevi = this.pomogliSlucajevi.filter(x => x.id !== s.id); this.toast('Kartica obrisana.', 'success'); },
        error: () => this.toast('Greška pri brisanju.', 'error')
      });
    });
  }

  loadBeneficiaries() {
    this.pomocService.getAllAdmin().subscribe({
      next: (data) => {
        this.beneficiaries = data.map(p => ({
          id: p.pomocId,
          name: p.naziv ?? '',
          description: p.opisPotrebe ?? '',
          goal: 5000, raised: 0, status: (p as any).statusSlucaja ?? 'aktivan',
          photoUrl: '', imageUrl: '',
          initials: ((p.naziv ?? '').split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase()).slice(0, 2),
          totalReceived: 0, volunteers: [], volunteersCount: 0
        }));
      }
    });
  }

  obrisiKorisnikaPomoci(b: any) {
    this.openConfirmAction(b.name, () => {
      this.http.delete(`/api/korisnici-pomoci/admin/${b.id}`, { responseType: 'text' }).subscribe({
        next: () => { this.loadBeneficiaries(); this.toast('Slučaj obrisan.', 'success'); },
        error: (err) => this.toast('Greška pri brisanju: ' + (err?.error ?? err?.status), 'error')
      });
    });
  }

  obrisiVolontera(v: any) {
    this.openConfirmAction(v.name, () => {
      this.adminService.promijeniStatus(v.id, 'uklonjen', 'Uklonjen od strane administratora').subscribe({
        next: () => {
          this.allVolunteers = this.allVolunteers.filter(x => x !== v);
          this.pendingVolunteersList = this.allVolunteers.filter(x => x.status === 'PENDING');
          this.updateVolunteerFilterCounts();
          this.toast('Volonter uklonjen.', 'success');
        },
        error: (err) => this.toast('Greška pri brisanju: ' + (err?.error ?? err?.status), 'error')
      });
    });
  }

  executeDelete() {
    this.confirmDeleteOpen = false;
    if (this.confirmDeleteCallback) { this.confirmDeleteCallback(); this.confirmDeleteCallback = null; }
  }

  zatvoriPomogliModal() { this.pomogliModalOpen = false; }

  viewAlerts() { this.setSection('alerts'); }
  setSection(s: string) {
    this.activeSection = s;
    if (s === 'pomogli' && this.pomogliSlucajevi.length === 0) this.loadPomogliSlucajevi();
    if (s === 'partneri' && this.adminPartneri.length === 0) this.loadPartnere();
  }

  getSectionTitle(): string {
    const map: any = {
      dashboard: 'Pregled', volunteers: 'Volonteri', beneficiaries: 'Korisnici Pomoći',
      offers: 'Ponude', reviews: 'Recenzije', transactions: 'Transakcije',
      donations: 'Donacije', logs: 'Logovi Aktivnosti', alerts: 'Sistemska Upozorenja',
      pomogli: 'Pomogli smo',
      partneri: 'Partneri'
    };
    return map[this.activeSection] || 'Admin Panel';
  }

  getSectionSubtitle(): string {
    const map: any = {
      dashboard: 'Pregled stanja platforme', volunteers: 'Upravljanje volonterima',
      beneficiaries: 'Upravljanje korisnicima pomoći', offers: 'Pregled i moderacija ponuda',
      reviews: 'Moderacija recenzija', transactions: 'Finansijske transakcije',
      donations: 'Lista donacija', logs: 'Sistemski logovi', alerts: 'Aktivna upozorenja',
      pomogli: 'Upravljajte karticama priča koje se prikazuju na javnoj stranici',
      partneri: 'Dodajte ili uklonite partnere i sponzore platforme'
    };
    return map[this.activeSection] || '';
  }

  getStatusLabel(status: string): string {
    const map: any = {
      'VERIFIED': 'Verifikovan', 'PENDING': 'Na Čekanju', 'INACTIVE': 'Neaktivan',
      'SUSPENDED': 'Suspendovan', 'REJECTED': 'Odbijen', 'REMOVED': 'Uklonjen',
      'ACTIVE': 'Aktivan', 'FULL': 'Popunjeno', 'SUCCESS': 'Uspješna', 'FAILED': 'Neuspješna'
    };
    return map[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const map: any = {
      'VERIFIED': 'sb-verified', 'PENDING': 'sb-pending', 'INACTIVE': 'sb-inactive',
      'SUSPENDED': 'sb-suspended', 'REJECTED': 'sb-rejected', 'REMOVED': 'sb-removed',
      'ACTIVE': 'sb-active', 'FULL': 'sb-suspended', 'SUCCESS': 'sb-verified', 'FAILED': 'sb-rejected'
    };
    return map[status] || 'sb-inactive';
  }

  openAddBeneficiary() {
    this.editingBeneficiary = null;
    this.newBeneficiary = { name: '', description: '', status: 'aktivan', photoUrl: '' };
    this.beneficiaryModalOpen = true;
  }

  editBeneficiary(b: any) {
    this.editingBeneficiary = b;
    this.newBeneficiary = { ...b };
    this.beneficiaryModalOpen = true;
  }

  closeBeneficiaryModal() { this.beneficiaryModalOpen = false; }

  saveBeneficiary() {
    if (!this.newBeneficiary.name.trim()) { this.toast('Ime je obavezno.', 'error'); return; }
    if (this.editingBeneficiary) {
      this.http.put<any>(`/api/korisnici-pomoci/${this.editingBeneficiary.id}`, {
        naziv: this.newBeneficiary.name,
        opisPotrebe: this.newBeneficiary.description,
        statusSlucaja: this.newBeneficiary.status
      }).subscribe({
        next: (updated) => {
          this.editingBeneficiary.name = updated.naziv;
          this.editingBeneficiary.description = updated.opisPotrebe;
          this.editingBeneficiary.status = updated.statusSlucaja ?? 'aktivan';
          this.beneficiaryModalOpen = false;
          this.toast('Slučaj sačuvan.', 'success');
        },
        error: () => this.toast('Greška pri čuvanju.', 'error')
      });
    } else {
      this.http.post<any>('/api/korisnici-pomoci/admin', {
        naziv: this.newBeneficiary.name,
        opisPotrebe: this.newBeneficiary.description
      }).subscribe({
        next: () => {
          this.loadBeneficiaries();
          this.beneficiaryModalOpen = false;
          this.toast('Slučaj dodan.', 'success');
        },
        error: () => this.toast('Greška pri dodavanju slučaja.', 'error')
      });
    }
  }

  uploadBeneficiaryModalPhoto() { /* foto upload nije implementiran */ }

  uploadBeneficiaryPhoto(b: any) { /* foto upload nije implementiran */ }

  private mapStatus(statusNaloga: string, verifikovan: boolean): string {
    if (statusNaloga === 'aktivan' && verifikovan) return 'VERIFIED';
    if (statusNaloga === 'na_cekanju') return 'PENDING';
    if (statusNaloga === 'suspendovan') return 'SUSPENDED';
    if (statusNaloga === 'uklonjen') return 'REMOVED';
    return 'INACTIVE';
  }

  private updateVolunteerFilterCounts() {
    this.volunteerFilters[0].count = this.allVolunteers.length;
    this.volunteerFilters[1].count = this.allVolunteers.filter(v => v.status === 'VERIFIED').length;
    this.volunteerFilters[2].count = this.allVolunteers.filter(v => v.status === 'PENDING').length;
    this.volunteerFilters[3].count = this.allVolunteers.filter(v => v.status === 'INACTIVE').length;
    this.volunteerFilters[4].count = this.allVolunteers.filter(v => v.status === 'SUSPENDED').length;
  }
}
