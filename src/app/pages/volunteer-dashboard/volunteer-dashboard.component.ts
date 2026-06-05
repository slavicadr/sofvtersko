import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './volunteer-dashboard.component.html',
  styleUrls: ['./volunteer-dashboard.component.scss']
})
export class VolunteerDashboardComponent implements OnInit {
  logoPath = 'assets/logoFinally.jpg';
  activeSection = 'overview';
  serviceModalOpen = false;
  editingOffer: any = null;
  pendingOffers = 2;
  hasNotifications = true;

  volunteer = {
    firstName: 'Marko', lastName: 'Jovanović',
    email: 'marko@gmail.com', phone: '+382 67 123 456',
    bio: 'IT stručnjak sa 5 godina iskustva u podršci i obrazovanju.',
    avatarUrl: '',
    status: 'VERIFIED' as 'PENDING' | 'VERIFIED' | 'INACTIVE' | 'SUSPENDED' | 'REMOVED',
  };

  editProfile = { ...this.volunteer };

  stats = { activeOffers: 3, completedServices: 12, avgRating: 4.9, totalRaised: 2850 };

  activeOffers = [
    { name: 'Online Poduka iz Matematike', category: 'Edukacija', price: 20, status: 'ACTIVE',  imageUrl: '' },
    { name: 'Popravka Računara',           category: 'IT pomoć',  price: 35, status: 'ACTIVE',  imageUrl: '' },
    { name: 'Online Konsalting',           category: 'IT pomoć',  price: 25, status: 'PENDING', imageUrl: '' },
  ];

  get allOffers() { return this.activeOffers; }

  // ── Recenzije — popunjene podacima ────────────────────────
  recentReviews = [
    { buyerName: 'Srđan Kadić',  buyerInitials: 'SK', rating: 5, starsArray: [1,2,3,4,5], emptyStars: [] as number[], comment: 'Profesionalne i zanimljive lekcije. Marko je odličan predavač!', offerName: 'Online Poduka iz Matematike', date: '02.06.2026.', reply: '', replyOpen: false, replyDraft: '' },
    { buyerName: 'Ana Petrović', buyerInitials: 'AP', rating: 4, starsArray: [1,2,3,4],   emptyStars: [5] as number[], comment: 'Brza i kvalitetna usluga. Računar radi odlično.', offerName: 'Popravka Računara', date: '28.05.2026.', reply: 'Hvala, sretan sam što sam pomogao!', replyOpen: false, replyDraft: '' },
    { buyerName: 'Jovana Milić', buyerInitials: 'JM', rating: 5, starsArray: [1,2,3,4,5], emptyStars: [] as number[], comment: 'Odlično online savjetovanje, preporučujem svima.', offerName: 'Online Konsalting', date: '20.05.2026.', reply: '', replyOpen: false, replyDraft: '' },
    { buyerName: 'Nikola Đ.',    buyerInitials: 'NĐ', rating: 3, starsArray: [1,2,3],     emptyStars: [4,5] as number[], comment: 'Solidna usluga, malo duže čekanje na odgovor.', offerName: 'Online Poduka iz Matematike', date: '10.05.2026.', reply: '', replyOpen: false, replyDraft: '' },
  ];

  get avgRating(): string {
    const avg = this.recentReviews.reduce((s, r) => s + r.rating, 0) / this.recentReviews.length;
    return avg.toFixed(1);
  }

  beneficiaries = [
    { id: 1, name: 'Petar Stojanović' },
    { id: 2, name: 'Marija Nikolić' },
    { id: 3, name: 'Maja Luković' },
  ];

  // ── Kategorije + "Nova kategorija" opcija ──────────────────
  categories = [
    'Edukacija', 'Zdravlje', 'IT pomoć', 'Prevoz', 'Kućni popravci',
    'Njega starijih', 'Hrana', 'Pravna pomoć', 'Psihološka podrška', 'Ostalo',
    'NOVA_KATEGORIJA'   // ← trigger za prikaz polja
  ];

  newCategoryName = '';    // korisnik upisuje ime nove kategorije
  showNewCategory  = false; // prikazuje input polje

  newOffer = this.emptyOffer();

  ngOnInit() {}

  setSection(s: string) { this.activeSection = s; }

  getSectionTitle(): string {
    const map: any = {
      overview: 'Pregled', services: 'Moje Ponude',
      reviews: 'Recenzije', profile: 'Moj Profil', settings: 'Podešavanja',
    };
    return map[this.activeSection] || '';
  }

  getSectionSubtitle(): string {
    const map: any = {
      overview: 'Pregled vašeg profila i aktivnosti',
      services: 'Upravljajte vašim uslugama i proizvodima',
      reviews: 'Recenzije kupaca za vaše usluge',
      profile: 'Uredite vaše podatke i sliku profila',
      settings: 'Podešavanja naloga i pristupačnosti',
    };
    return map[this.activeSection] || '';
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
    const map: any = { ACTIVE: 'Aktivna', PENDING: 'Na čekanju', REJECTED: 'Odbijena', REMOVED: 'Uklonjena' };
    return map[status] || status;
  }

  // ── Kategorija event handler ───────────────────────────────
  onCategoryChange() {
    this.showNewCategory = this.newOffer.category === 'NOVA_KATEGORIJA';
    if (!this.showNewCategory) this.newCategoryName = '';
  }

  // ── Service modal ──────────────────────────────────────────
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
    if (confirm(`Obrisati ponudu "${o.name}"?`)) {
      this.activeOffers = this.activeOffers.filter(x => x !== o);
    }
  }

  closeServiceModal() { this.serviceModalOpen = false; }

  saveOffer() {
    if (!this.newOffer.name || !this.newOffer.category || !this.newOffer.price) {
      alert('Popunite sva obavezna polja.');
      return;
    }
    // Nova kategorija — validacija
    if (this.newOffer.category === 'NOVA_KATEGORIJA') {
      if (!this.newCategoryName.trim()) {
        alert('Unesite naziv nove kategorije.');
        return;
      }
      this.newOffer.category = this.newCategoryName.trim();
      this.newOffer.newCategoryPending = true; // flag za backend
    }

    const finalOffer = { ...this.newOffer, status: 'PENDING' };

    if (this.editingOffer) {
      Object.assign(this.editingOffer, finalOffer);
      alert('Ponuda ažurirana.');
    } else {
      this.activeOffers.push(finalOffer);
      this.pendingOffers++;
      if (this.newOffer.newCategoryPending) {
        alert(`Ponuda je poslana na odobrenje.\nNova kategorija "${this.newOffer.category}" je poslana adminu na pregled.`);
      } else {
        alert('Ponuda poslana administratoru na odobrenje.');
      }
    }
    this.serviceModalOpen = false;
  }

  // ── Profil ─────────────────────────────────────────────────
  saveProfile() {
    Object.assign(this.volunteer, this.editProfile);
    alert('Profil sačuvan.');
  }

  confirmDeleteProfile() {
    if (confirm('Da li ste sigurni da želite obrisati profil? Ova akcija je trajna.')) {
      alert('Profil je obrisan.');
    }
  }

  uploadAvatar() {
    const url = prompt('Putanja do profilne slike (npr. assets/images/avatars/marko.jpg):');
    if (url) { this.volunteer.avatarUrl = url; this.editProfile.avatarUrl = url; }
  }

  uploadOfferImage(o: any) {
    const url = prompt(`Putanja do slike za "${o.name}":`, 'assets/images/offers/');
    if (url) o.imageUrl = url;
  }

  uploadNewOfferImage() {
    const url = prompt('Putanja do slike ponude:', 'assets/images/offers/');
    if (url) this.newOffer.imageUrl = url;
  }

  // ── Recenzije ──────────────────────────────────────────────
  submitReply(r: any) {
    if (r.replyDraft.trim()) {
      r.reply = r.replyDraft;
      r.replyOpen = false;
      r.replyDraft = '';
    }
  }

  showNotifications() {
    alert('Nemate novih obavještenja.');
    this.hasNotifications = false;
  }

  private emptyOffer() {
    return { name: '', category: '', price: null as any, description: '', beneficiaryId: '', imageUrl: '', newCategoryPending: false };
  }
}
