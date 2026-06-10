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
    let list = this.allVolunteers;
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

    this.pomocService.getAll().subscribe({
      next: (data) => {
        this.beneficiaries = data.map(p => ({
          id: p.pomocId,
          name: p.naziv,
          description: p.opisPotrebe,
          goal: 5000, raised: 0, status: 'ACTIVE',
          photoUrl: '', imageUrl: '',
          initials: (p.naziv.split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase()).slice(0, 2),
          totalReceived: 0, volunteers: [], volunteersCount: 0
        }));
      }
    });

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
    this.adminService.getAllVerifikacije(); // trigger — for now update status directly
    this.uslugaService.updateStatus(o.id, 'aktivna').subscribe({
      next: () => { o.status = 'ACTIVE'; alert(`Ponuda "${o.name}" odobrena.`); },
      error: () => alert('Greška pri odobravanju.')
    });
  }

  rejectOffer(o: any) {
    const reason = prompt('Razlog odbijanja:');
    if (!reason) return;
    this.uslugaService.updateStatus(o.id, 'odbijena').subscribe({
      next: () => { o.status = 'REJECTED'; },
      error: () => alert('Greška.')
    });
  }

  removeOffer(o: any) {
    if (confirm(`Ukloniti "${o.name}"?`)) {
      this.uslugaService.updateStatus(o.id, 'uklonjena').subscribe({
        next: () => o.status = 'REMOVED'
      });
    }
  }

  openStatusChange(target: any) {
    this.statusChangeTarget = target;
    this.newStatus = 'aktivan';
    this.statusChangeReason = '';
    this.statusModalOpen = true;
  }

  closeStatusModal() { this.statusModalOpen = false; }

  confirmStatusChange() {
    if (!this.statusChangeReason.trim()) { alert('Molimo unesite razlog.'); return; }
    const id = this.statusChangeTarget?.id;
    if (!id) return;
    this.adminService.promijeniStatus(id, this.newStatus, this.statusChangeReason).subscribe({
      next: (k) => {
        if (this.statusChangeTarget) {
          this.statusChangeTarget.status = this.mapStatus(k.statusNaloga, k.verifikovan);
        }
        alert(`Status promijenjen.`);
        this.statusModalOpen = false;
        this.pendingVolunteersList = this.allVolunteers.filter(v => v.status === 'PENDING');
        this.updateVolunteerFilterCounts();
      },
      error: () => alert('Greška pri promjeni statusa.')
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
    if (!confirm(`Označiti "${k.serviceName}" kao realizovanu?`)) return;
    this.kupovinaService.oznaciRealizovano(k.id).subscribe({
      next: (updated) => {
        k.statusIsporuke = updated.statusIsporuke;
        k.datumRealizacije = updated.datumRealizacije
          ? new Date(updated.datumRealizacije).toLocaleDateString('bs-BA') : '';
      },
      error: (err) => alert(err?.error ?? 'Greška pri označavanju.')
    });
  }

  approveVolunteer(v: any) {
    const reason = 'Profil odobren.';
    this.adminService.promijeniStatus(v.id, 'aktivan', reason).subscribe({
      next: () => {
        v.status = 'VERIFIED';
        this.pendingVolunteersList = this.pendingVolunteersList.filter(p => p.id !== v.id);
        this.updateVolunteerFilterCounts();
        alert(`Volonter ${v.name} verifikovan.`);
      },
      error: () => alert('Greška.')
    });
  }

  rejectVolunteer(v: any) {
    const reason = prompt('Razlog odbijanja:');
    if (!reason) return;
    this.adminService.promijeniStatus(v.id, 'suspendovan', reason).subscribe({
      next: () => {
        v.status = 'REJECTED';
        this.pendingVolunteersList = this.pendingVolunteersList.filter(p => p.id !== v.id);
        this.updateVolunteerFilterCounts();
        alert(`Verifikacija odbijena.`);
      }
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
    if (!confirm('Obrisati recenziju?')) return;
    this.http.delete(`/api/recenzije/${r.id}`, { responseType: 'text' }).subscribe({
      next: () => { this.allReviews = this.allReviews.filter(x => x !== r); },
      error: (err) => alert(err?.error ?? 'Greška pri brisanju recenzije.')
    });
  }

  viewAlerts() { this.setSection('alerts'); }
  setSection(s: string) { this.activeSection = s; }

  getSectionTitle(): string {
    const map: any = {
      dashboard: 'Pregled', volunteers: 'Volonteri', beneficiaries: 'Korisnici Pomoći',
      offers: 'Ponude', reviews: 'Recenzije', transactions: 'Transakcije',
      donations: 'Donacije', logs: 'Logovi Aktivnosti', alerts: 'Sistemska Upozorenja'
    };
    return map[this.activeSection] || 'Admin Panel';
  }

  getSectionSubtitle(): string {
    const map: any = {
      dashboard: 'Pregled stanja platforme', volunteers: 'Upravljanje volonterima',
      beneficiaries: 'Upravljanje korisnicima pomoći', offers: 'Pregled i moderacija ponuda',
      reviews: 'Moderacija recenzija', transactions: 'Finansijske transakcije',
      donations: 'Lista donacija', logs: 'Sistemski logovi', alerts: 'Aktivna upozorenja'
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
    this.newBeneficiary = { name: '', description: '', status: 'ACTIVE', photoUrl: '' };
    this.beneficiaryModalOpen = true;
  }

  editBeneficiary(b: any) {
    this.editingBeneficiary = b;
    this.newBeneficiary = { ...b };
    this.beneficiaryModalOpen = true;
  }

  closeBeneficiaryModal() { this.beneficiaryModalOpen = false; }

  saveBeneficiary() {
    if (!this.newBeneficiary.name.trim()) { alert('Ime je obavezno.'); return; }
    if (this.editingBeneficiary) {
      Object.assign(this.editingBeneficiary, this.newBeneficiary);
    } else {
      this.beneficiaries.push({
        id: Date.now(), ...this.newBeneficiary,
        goal: 0, raised: 0, imageUrl: this.newBeneficiary.photoUrl,
        initials: this.newBeneficiary.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        totalReceived: 0, volunteers: [], volunteersCount: 0
      });
    }
    this.beneficiaryModalOpen = false;
  }

  uploadBeneficiaryModalPhoto() {
    const path = prompt('Putanja do fotografije:');
    if (path) this.newBeneficiary.photoUrl = path;
  }

  uploadBeneficiaryPhoto(b: any) {
    const path = prompt(`Fotografija za "${b.name}":`);
    if (path) { b.photoUrl = path; b.imageUrl = path; }
  }

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
