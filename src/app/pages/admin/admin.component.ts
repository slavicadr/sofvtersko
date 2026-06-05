import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  admin = { name: 'Admin Korisnik', avatarUrl: '' };

  // ── KPI — phIcon + trendUp polja ─────────────────────────
  kpis = [
    { icon: '🤝', phIcon: 'ph-handshake',       label: 'Ukupno Volontera',    value: 128,   iconBg: 'rgba(45,107,85,0.1)',   trend: '+8 ovaj mj.',  trendUp: true  },
    { icon: '⏳', phIcon: 'ph-clock-countdown',  label: 'Na Verifikaciji',     value: 7,     iconBg: 'rgba(255,160,60,0.1)',  trend: 'Na čekanju',   trendUp: false },
    { icon: '🛠', phIcon: 'ph-toolbox',          label: 'Aktivnih Ponuda',     value: 45,    iconBg: 'rgba(122,182,72,0.1)',  trend: '+12 ovaj mj.', trendUp: true  },
    { icon: '💳', phIcon: 'ph-credit-card',      label: 'Transakcija',         value: 1230,  iconBg: 'rgba(52,152,219,0.1)',  trend: '+64 ovaj mj.', trendUp: true  },
    { icon: '💝', phIcon: 'ph-hand-heart',       label: 'Donacija (€)',        value: 24680, iconBg: 'rgba(142,68,173,0.1)',  trend: '↑ Raste',      trendUp: true  },
    { icon: '⚠️', phIcon: 'ph-warning-circle',   label: 'Sumnjive Aktivnosti', value: 5,     iconBg: 'rgba(231,76,60,0.1)',   trend: 'Provjeriti',   trendUp: false },
  ];

  // ── Pending verifications ─────────────────────────────────
  pendingVolunteersList = [
    { id: 1, name: 'Marija Nikolić',   initials: 'MN', services: 'Popravka elektronike', status: 'PENDING' },
    { id: 2, name: 'Aleksa Kovačević', initials: 'AK', services: 'IT Podrška',           status: 'PENDING' },
    { id: 3, name: 'Jelena Petrović',  initials: 'JP', services: 'Online Poduka',        status: 'PENDING' },
  ];

  get pendingVolunteers(): number { return this.pendingVolunteersList.length; }

  // ── Suspicious activities ─────────────────────────────────
  suspiciousActivities = [
    { text: 'Neuspjele transakcije (>10 u sat)', count: 18 },
    { text: 'Sumnjive prijave s nepoznatih IP',  count: 5  },
    { text: 'Odbijene ponude ove nedelje',        count: 8  },
  ];

  // ── Beneficiaries ─────────────────────────────────────────
  beneficiaries = [
    { id: 1, name: 'Slaven M.',      description: 'Liječenje i rehabilitacija', goal: 5000,  raised: 3200, status: 'ACTIVE', photoUrl: '', imageUrl: '', initials: 'SM', totalReceived: 3200, volunteers: ['Marko J.', 'Ana M.'],              volunteersCount: 2 },
    { id: 2, name: 'Maja L.',        description: 'Operacija srca',             goal: 8000,  raised: 2900, status: 'ACTIVE', photoUrl: '', imageUrl: '', initials: 'ML', totalReceived: 2900, volunteers: ['Nikola S.'],                       volunteersCount: 1 },
    { id: 3, name: 'Porodica Đurić', description: 'Obnova kuće nakon požara',   goal: 12000, raised: 7500, status: 'ACTIVE', photoUrl: '', imageUrl: '', initials: 'PĐ', totalReceived: 7500, volunteers: ['Marko J.', 'Ana M.', 'Petra L.'], volunteersCount: 3 },
  ];

  raisedPercent(b: any): number { return Math.min(100, Math.round((b.raised / b.goal) * 100)); }
  getBeneficiaryStatusLabel(s: string): string { return this.getStatusLabel(s); }

  // ── Volunteer filters ─────────────────────────────────────
  volunteerFilters = [
    { label: 'Svi',          value: 'Svi',          count: 0 },
    { label: 'Verifikovani', value: 'Verifikovani', count: 0 },
    { label: 'Na Čekanju',   value: 'Na Čekanju',   count: 0 },
    { label: 'Neaktivni',    value: 'Neaktivni',    count: 0 },
    { label: 'Suspendovani', value: 'Suspendovani', count: 0 },
  ];
  volunteerFilter = 'Svi';
  volunteerSearch = '';

  allVolunteers = [
    { id: 1, name: 'Marko Jovanović', email: 'marko@example.com', initials: 'MJ', avatarUrl: '', servicesCount: 3, rating: 4.9, status: 'VERIFIED',  joinDate: '15.01.2026.' },
    { id: 2, name: 'Ana Milić',       email: 'ana@example.com',   initials: 'AM', avatarUrl: '', servicesCount: 2, rating: 4.7, status: 'VERIFIED',  joinDate: '20.02.2026.' },
    { id: 3, name: 'Nikola Stanić',   email: 'nikola@example.com',initials: 'NS', avatarUrl: '', servicesCount: 1, rating: 4.2, status: 'PENDING',   joinDate: '01.06.2026.' },
    { id: 4, name: 'Petra Lazović',   email: 'petra@example.com', initials: 'PL', avatarUrl: '', servicesCount: 0, rating: 0,   status: 'SUSPENDED', joinDate: '10.03.2026.' },
    { id: 5, name: 'Igor Vuković',    email: 'igor@example.com',  initials: 'IV', avatarUrl: '', servicesCount: 5, rating: 4.5, status: 'INACTIVE',  joinDate: '05.12.2025.' },
  ];

  get filteredVolunteers() {
    let list = this.allVolunteers;
    const map: any = { 'Verifikovani': 'VERIFIED', 'Na Čekanju': 'PENDING', 'Neaktivni': 'INACTIVE', 'Suspendirani': 'SUSPENDED' };
    if (this.volunteerFilter !== 'Svi') list = list.filter(v => v.status === map[this.volunteerFilter]);
    if (this.volunteerSearch) {
      const q = this.volunteerSearch.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
    }
    return list;
  }

  getVolunteerStatusLabel(s: string): string { return this.getStatusLabel(s); }

  // ── Offers ────────────────────────────────────────────────
  allOffers = [
    { id: 1, name: 'Online Poduka',        volunteerName: 'Marko Jovanović', category: 'Obrazovanje', beneficiaryName: 'Slaven M.',      price: 20, status: 'ACTIVE',   created: '01.05.2026.', imageUrl: '', emoji: '📚' },
    { id: 2, name: 'IT Podrška',           volunteerName: 'Ana Milić',       category: 'IT',          beneficiaryName: 'Maja L.',        price: 30, status: 'PENDING',  created: '28.05.2026.', imageUrl: '', emoji: '💻' },
    { id: 3, name: 'Popravka Slavine',     volunteerName: 'Nikola Stanić',   category: 'Majstorstvo', beneficiaryName: 'Slaven M.',      price: 10, status: 'PENDING',  created: '01.06.2026.', imageUrl: '', emoji: '🔧' },
    { id: 4, name: 'Psihološko Savjet.',   volunteerName: 'Petra Lazović',   category: 'Zdravlje',    beneficiaryName: 'Maja L.',        price: 25, status: 'REJECTED', created: '10.04.2026.', imageUrl: '', emoji: '🧠' },
    { id: 5, name: 'Online Konsalting',    volunteerName: 'Igor Vuković',    category: 'Biznis',      beneficiaryName: 'Porodica Đurić', price: 50, status: 'ACTIVE',   created: '15.03.2026.', imageUrl: '', emoji: '💼' },
  ];
  offerFilter = 'Sve';
  offerSearch  = '';

  get filteredOffers() {
    let list = this.allOffers;
    const map: any = { 'Aktivne': 'ACTIVE', 'Na Čekanju': 'PENDING', 'Odbijene': 'REJECTED', 'Uklonjene': 'REMOVED' };
    if (this.offerFilter !== 'Sve') list = list.filter(o => o.status === map[this.offerFilter]);
    if (this.offerSearch) { const q = this.offerSearch.toLowerCase(); list = list.filter(o => o.name.toLowerCase().includes(q)); }
    return list;
  }

  get pendingOffers(): number { return this.allOffers.filter(o => o.status === 'PENDING').length; }
  getOfferStatusLabel(s: string): string { return this.getStatusLabel(s); }

  approveOffer(o: any) {
    const reason = prompt('Razlog odobrenja (opcionalno):') || 'Odobreno.';
    o.status = 'ACTIVE';
    alert(`Ponuda "${o.name}" odobrena.`);
  }
  rejectOffer(o: any) {
    const reason = prompt('Razlog odbijanja:');
    if (!reason) return;
    o.status = 'REJECTED';
  }
  removeOffer(o: any) {
    if (confirm(`Ukloniti "${o.name}"?`)) o.status = 'REMOVED';
  }

  // ── Transactions ──────────────────────────────────────────
  allTransactions = [
    { id: 'TRX-001', date: '03.06.2026. 09:14', buyerName: 'Srđan Kadić',  offer: 'Online Poduka',     beneficiaryName: 'Slaven M.',      amount: 20,  status: 'SUCCESS' },
    { id: 'TRX-002', date: '02.06.2026. 16:45', buyerName: 'Anonimno',     offer: 'IT Podrška',        beneficiaryName: 'Maja L.',        amount: 30,  status: 'SUCCESS' },
    { id: 'TRX-003', date: '02.06.2026. 11:22', buyerName: 'Jovana Radić', offer: 'Online Konsalting', beneficiaryName: 'Porodica Đurić', amount: 50,  status: 'FAILED'  },
    { id: 'TRX-004', date: '01.06.2026. 14:10', buyerName: 'Marko M.',     offer: 'Direktna Donacija', beneficiaryName: 'Slaven M.',      amount: 100, status: 'SUCCESS' },
    { id: 'TRX-005', date: '01.06.2026. 09:05', buyerName: 'Anonimno',     offer: 'Online Poduka',     beneficiaryName: 'Maja L.',        amount: 20,  status: 'PENDING' },
  ];
  txSearch       = '';
  txStatusFilter = '';
  txDateFrom     = '';
  txDateTo       = '';

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
    return this.filteredTransactions
      .filter(t => t.status === 'SUCCESS')
      .reduce((s, t) => s + t.amount, 0);
  }

  // ── Donations ─────────────────────────────────────────────
  donations = [
    { id: 1, donor: 'Srđan Kadić', anonymous: false, beneficiary: 'Slaven M.',      amount: 100, type: 'Direktna', date: '03.06.2026. 10:20' },
    { id: 2, donor: '',            anonymous: true,  beneficiary: 'Maja L.',        amount: 50,  type: 'Direktna', date: '02.06.2026. 15:30' },
    { id: 3, donor: 'Jovana R.',   anonymous: false, beneficiary: 'Porodica Đurić', amount: 200, type: 'Direktna', date: '01.06.2026. 09:00' },
  ];

  // ── Activity logs ─────────────────────────────────────────
  activityLogs = [
    { type: 'info',  text: 'Volonter Marko Jovanović verifikovan',              user: 'Admin',  time: '09:14', typeLabel: 'Info'    },
    { type: 'info',  text: 'Administrator prijava – IP 192.168.1.1',             user: 'Admin',  time: '09:00', typeLabel: 'Info'    },
    { type: 'warn',  text: '3 neuspješna pokušaja prijave – nikola@example.com', user: 'Sistem', time: '08:42', typeLabel: 'Upozor.' },
    { type: 'error', text: 'Transakcija TRX-003 neuspješna',                     user: 'Sistem', time: '07:55', typeLabel: 'Greška'  },
    { type: 'info',  text: 'Nova ponuda "Popravka Slavine" na pregledu',         user: 'Sistem', time: '07:30', typeLabel: 'Info'    },
  ];

  getLogIcon(type: string): string {
    const map: any = { info: 'ph-info', warn: 'ph-warning', error: 'ph-x-circle' };
    return map[type] || 'ph-info';
  }

  // ── Reviews ───────────────────────────────────────────────
  allReviews = [
    { id: 1, buyerName: 'Srđan K.',  serviceName: 'Online Poduka',     rating: 5, starsDisplay: '★★★★★', comment: 'Odlična nastava, preporučujem svima.' },
    { id: 2, buyerName: 'Jovana R.', serviceName: 'IT Podrška',        rating: 2, starsDisplay: '★★☆☆☆', comment: 'Kasno se javio, nije riješio problem.'  },
    { id: 3, buyerName: 'Anonimno',  serviceName: 'Online Konsalting', rating: 4, starsDisplay: '★★★★☆', comment: 'Korisno savjetovanje.'                  },
  ];

  // ── System alerts ─────────────────────────────────────────
  systemAlerts = 3;

  systemAlertsList = [
    { level: 'high',   title: '18 neuspjelih transakcija',   desc: 'Neuobičajeno velik broj u posljednja 2 sata',       time: '10 min' },
    { level: 'high',   title: '5 sumnjivih prijava',         desc: 'Više pokušaja s nepoznatih IP adresa',              time: '35 min' },
    { level: 'medium', title: 'Platni procesor spor',        desc: 'Prosječno vrijeme odgovora +2.3s',                  time: '1h'     },
    { level: 'low',    title: 'Backup u toku',               desc: 'Dnevna sigurnosna kopija baze podataka',            time: '2h'     },
  ];

  // ── Status change modal ───────────────────────────────────
  statusModalOpen     = false;
  statusChangeTarget: any = null;
  newStatus           = 'VERIFIED';
  statusChangeReason  = '';

  openStatusChange(target: any) {
    this.statusChangeTarget = target;
    this.newStatus          = target.status || 'VERIFIED';
    this.statusChangeReason = '';
    this.statusModalOpen    = true;
  }
  closeStatusModal() { this.statusModalOpen = false; }
  confirmStatusChange() {
    if (!this.statusChangeReason.trim()) { alert('Molimo unesite razlog.'); return; }
    if (this.statusChangeTarget) this.statusChangeTarget.status = this.newStatus;
    alert(`Status promijenjen.\nRazlog: ${this.statusChangeReason}`);
    this.statusModalOpen = false;
  }

  // ── Beneficiary modal ─────────────────────────────────────
  beneficiaryModalOpen = false;
  editingBeneficiary: any = null;
  newBeneficiary: any    = { name: '', description: '', status: 'ACTIVE', photoUrl: '' };

  openAddBeneficiary() {
    this.editingBeneficiary = null;
    this.newBeneficiary     = { name: '', description: '', status: 'ACTIVE', photoUrl: '' };
    this.beneficiaryModalOpen = true;
  }
  editBeneficiary(b: any) {
    this.editingBeneficiary = b;
    this.newBeneficiary     = { ...b };
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
    const path = prompt('Putanja do fotografije (npr. assets/images/beneficiaries/ime.jpg):');
    if (path) this.newBeneficiary.photoUrl = path;
  }
  uploadBeneficiaryPhoto(b: any) {
    const path = prompt(`Fotografija za "${b.name}":`);
    if (path) { b.photoUrl = path; b.imageUrl = path; }
  }

  // ── Volunteers ────────────────────────────────────────────
  approveVolunteer(v: any) {
    const reason = prompt('Razlog odobrenja (opcionalno):') || 'Profil odobren.';
    v.status = 'VERIFIED';
    this.pendingVolunteersList = this.pendingVolunteersList.filter(p => p.name !== v.name);
    const vol = this.allVolunteers.find(x => x.name === v.name);
    if (vol) vol.status = 'VERIFIED';
    alert(`Volonter ${v.name} verifikovan.`);
  }
  rejectVolunteer(v: any) {
    const reason = prompt('Razlog odbijanja:');
    if (!reason) return;
    this.pendingVolunteersList = this.pendingVolunteersList.filter(p => p.name !== v.name);
    const vol = this.allVolunteers.find(x => x.name === v.name);
    if (vol) vol.status = 'REJECTED';
    alert(`Verifikacija odbijena.\nRazlog: ${reason}`);
  }

  deleteReview(r: any) {
    if (confirm('Obrisati recenziju?')) this.allReviews = this.allReviews.filter(x => x !== r);
  }

  viewAlerts() { this.setSection('alerts'); }

  // ── Helpers ───────────────────────────────────────────────
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
      dashboard: 'Pregled stanja platforme',      volunteers: 'Upravljanje volonterima',
      beneficiaries: 'Upravljanje korisnicima pomoći', offers: 'Pregled i moderacija ponuda',
      reviews: 'Moderacija recenzija',            transactions: 'Finansijske transakcije',
      donations: 'Lista donacija',                logs: 'Sistemski logovi',
      alerts: 'Aktivna upozorenja'
    };
    return map[this.activeSection] || '';
  }

  getStatusLabel(status: string): string {
    const map: any = {
      'VERIFIED': 'Verifikovan', 'PENDING': 'Na Čekanju', 'INACTIVE': 'Neaktivan',
      'SUSPENDED': 'Suspendovan', 'REJECTED': 'Odbijen',   'REMOVED': 'Uklonjen',
      'ACTIVE': 'Aktivan',       'SUCCESS': 'Uspješna',    'FAILED': 'Neuspješna'
    };
    return map[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const map: any = {
      'VERIFIED': 'sb-verified',   'PENDING': 'sb-pending',  'INACTIVE': 'sb-inactive',
      'SUSPENDED': 'sb-suspended', 'REJECTED': 'sb-rejected','REMOVED': 'sb-removed',
      'ACTIVE': 'sb-active',       'SUCCESS': 'sb-verified', 'FAILED': 'sb-rejected'
    };
    return map[status] || 'sb-inactive';
  }

  ngOnInit(): void {
    this.volunteerFilters[0].count = this.allVolunteers.length;
    this.volunteerFilters[1].count = this.allVolunteers.filter(v => v.status === 'VERIFIED').length;
    this.volunteerFilters[2].count = this.allVolunteers.filter(v => v.status === 'PENDING').length;
    this.volunteerFilters[3].count = this.allVolunteers.filter(v => v.status === 'INACTIVE').length;
    this.volunteerFilters[4].count = this.allVolunteers.filter(v => v.status === 'SUSPENDED').length;
  }
}
