import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { KupovinaService } from '../../core/services/kupovina.service';
import { DonacijaService } from '../../core/services/donacija.service';
import { Korisnik } from '../../core/models/models';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {
  logoPath = 'assets/logoFinally.jpg';
  activeSection = 'overview';
  reviewModalOpen = false;
  reviewingPurchase: any = null;
  reviewForm = { rating: 0, comment: '' };

  user: Korisnik | null = null;

  buyer = {
    firstName: '', lastName: '',
    email: '', phone: '',
    avatarUrl: '',
    displayPreference: 'name',
  };

  editBuyer = { ...this.buyer };

  stats = { totalPurchases: 0, totalSpent: 0, totalDonated: 0, reviewsLeft: 0 };

  recentPurchases: any[] = [];
  get allPurchases() { return this.recentPurchases; }

  myReviews: any[] = [];
  myDonations: any[] = [];

  constructor(
    private auth: AuthService,
    private kupovinaService: KupovinaService,
    private donacijaService: DonacijaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser;
    if (this.user) {
      this.buyer = {
        firstName: this.user.ime,
        lastName: this.user.prezime,
        email: this.user.email,
        phone: this.user.telefon ?? '',
        avatarUrl: '',
        displayPreference: this.user.prikazAnonimno ? 'anonymous' : 'name',
      };
      this.editBuyer = { ...this.buyer };
      this.loadPurchases();
      this.loadDonations();
    }
  }

  loadPurchases() {
    if (!this.user) return;
    this.kupovinaService.getByKupac(this.user.korisnikId).subscribe({
      next: (data) => {
        this.recentPurchases = data.map(k => ({
          id: k.kupovinaId,
          serviceName: k.uslugaProizvod?.naziv ?? '',
          volunteerName: k.uslugaProizvod?.volonter
            ? `${k.uslugaProizvod.volonter.ime} ${k.uslugaProizvod.volonter.prezime[0]}.`
            : '',
          beneficiaryName: k.korisnikPomoci?.naziv ?? '',
          amount: k.iznos,
          date: k.datumKupovine ? new Date(k.datumKupovine).toLocaleDateString('bs-BA') : '',
          statusIsporuke: k.statusIsporuke ?? 'na_cekanju',
          datumRealizacije: k.datumRealizacije ? new Date(k.datumRealizacije).toLocaleDateString('bs-BA') : '',
          reviewed: false,
          emoji: '',
          serviceImageUrl: '',
        }));
        this.stats.totalPurchases = data.length;
        this.stats.totalSpent = data.reduce((s, k) => s + k.iznos, 0);
        // Load existing reviews to mark which purchases are already reviewed
        this.loadReviews();
      }
    });
  }

  loadReviews() {
    if (!this.user) return;
    this.http.get<any[]>(`/api/recenzije/kupac/${this.user.korisnikId}`).subscribe({
      next: (reviews) => {
        const reviewedPurchaseIds = new Set(reviews.map(r => r.kupovina?.kupovinaId));
        this.recentPurchases.forEach(p => { p.reviewed = reviewedPurchaseIds.has(p.id); });
        this.myReviews = reviews.map(r => ({
          starsDisplay: '★'.repeat(r.brojZvjezdica) + '☆'.repeat(5 - r.brojZvjezdica),
          serviceName: r.kupovina?.uslugaProizvod?.naziv ?? '',
          date: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : '',
          comment: r.komentar ?? '',
          volunteerReply: ''
        }));
        this.stats.reviewsLeft = this.recentPurchases.filter(p => !p.reviewed && p.statusIsporuke === 'realizovano').length;
      }
    });
  }

  loadDonations() {
    if (!this.user) return;
    this.donacijaService.getAll().subscribe({
      next: (data) => {
        this.myDonations = data
          .filter(d => d.donator?.korisnikId === this.user!.korisnikId)
          .map(d => this.donacijaService.mapToView(d));
        this.stats.totalDonated = this.myDonations.reduce((s, d) => s + d.amount, 0);
      }
    });
  }

  setSection(s: string) { this.activeSection = s; }

  getSectionTitle(): string {
    const map: any = {
      overview: `Dobrodošli, ${this.buyer.firstName}!`,
      purchases: 'Moje Kupovine',
      reviews: 'Moje Recenzije',
      donations: 'Moje Donacije',
      profile: 'Moj Profil'
    };
    return map[this.activeSection] || '';
  }

  getSectionSubtitle(): string {
    const map: any = {
      overview: 'Pregled vaših kupovina i aktivnosti',
      purchases: 'Sve vaše kupovine usluga i proizvoda',
      reviews: 'Recenzije koje ste ostavili',
      donations: 'Vaše direktne donacije',
      profile: 'Uredite vaše podatke'
    };
    return map[this.activeSection] || '';
  }

  openReviewModal(p: any) {
    this.reviewingPurchase = p;
    this.reviewForm = { rating: 0, comment: '' };
    this.reviewModalOpen = true;
  }

  closeReviewModal(event?: any) { this.reviewModalOpen = false; }

  submitReview() {
    if (this.reviewForm.rating === 0 || !this.reviewingPurchase || !this.user) return;
    this.http.post<any>('/api/recenzije/dodaj', {
      kupovinaId: this.reviewingPurchase.id,
      brojZvjezdica: this.reviewForm.rating,
      komentar: this.reviewForm.comment
    }).subscribe({
      next: (r) => {
        this.reviewingPurchase.reviewed = true;
        this.myReviews.push({
          starsDisplay: '★'.repeat(r.brojZvjezdica) + '☆'.repeat(5 - r.brojZvjezdica),
          serviceName: this.reviewingPurchase?.serviceName ?? '',
          date: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : new Date().toLocaleDateString('bs-BA'),
          comment: r.komentar ?? '',
          volunteerReply: ''
        });
        this.stats.reviewsLeft = Math.max(0, this.stats.reviewsLeft - 1);
        this.reviewModalOpen = false;
      },
      error: (err) => {
        const msg = typeof err?.error === 'string' ? err.error : 'Greška pri slanju recenzije.';
        alert(msg);
      }
    });
  }

  oznaciRealizovano(p: any) {
    if (!confirm(`Označiti uslugu "${p.serviceName}" kao završenu?`)) return;
    this.kupovinaService.oznaciRealizovano(p.id).subscribe({
      next: (k) => {
        p.statusIsporuke = k.statusIsporuke;
        p.datumRealizacije = k.datumRealizacije ? new Date(k.datumRealizacije).toLocaleDateString('bs-BA') : '';
      },
      error: (err) => alert(err?.error ?? 'Greška pri označavanju.')
    });
  }

  saveProfile() { Object.assign(this.buyer, this.editBuyer); alert('Profil sačuvan.'); }

  uploadAvatar() {
    const url = prompt('Unesite putanju do slike:');
    if (url) { this.buyer.avatarUrl = url; this.editBuyer.avatarUrl = url; }
  }

  openAccessibility() { alert('Accessibility panel – implementirati u Fazi 2'); }
}
