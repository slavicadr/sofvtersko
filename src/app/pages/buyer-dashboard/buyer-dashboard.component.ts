import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent {
  logoPath = 'assets/logoFinally.jpg';
  activeSection = 'overview';
  reviewModalOpen = false;
  reviewingPurchase: any = null;
  reviewForm = { rating: 0, comment: '' };

  buyer = {
    firstName: 'Sanja', lastName: 'Marković',
    email: 'sanja@gmail.com', phone: '+382 68 555 444',
    avatarUrl: '', // Postavi: 'assets/images/avatars/sanja.jpg'
    displayPreference: 'name',
  };

  editBuyer = { ...this.buyer };

  stats = { totalPurchases: 8, totalSpent: 185, totalDonated: 60, reviewsLeft: 5 };

  recentPurchases = [
    { serviceName: 'Online časovi iz Matematike', volunteerName: 'Marko J.', beneficiaryName: 'Petar S.', amount: 20, date: '02.06.2024.', reviewed: false, emoji: '', serviceImageUrl: '' },
    { serviceName: 'Kurs Meditacije', volunteerName: 'Ana M.',  beneficiaryName: 'Marija N.', amount: 25, date: '28.05.2024.', reviewed: true, emoji: '', serviceImageUrl: '' },
  ];

  get allPurchases() { return this.recentPurchases; }

  myReviews = [
    { starsDisplay: '★★★★★', serviceName: 'Kurs Meditacije', date: '29.05.2024.', comment: 'Sjajan kurs, veoma zadovoljna!', volunteerReply: 'Hvala puno, drago mi je da ste zadovoljni!' },
  ];

  setSection(s: string) { this.activeSection = s; }

  getSectionTitle(): string {
    const map: any = { overview: 'Dobrodošli, ' + this.buyer.firstName + '!', purchases: 'Moje Kupovine', reviews: 'Moje Recenzije', donations: 'Moje Donacije', profile: 'Moj Profil' };
    return map[this.activeSection] || '';
  }

  getSectionSubtitle(): string {
    const map: any = { overview: 'Pregled vaših kupovina i aktivnosti', purchases: 'Sve vaše kupovine usluga i proizvoda', reviews: 'Recenzije koje ste ostavili', donations: 'Vaše direktne donacije', profile: 'Uredite vaše podatke' };
    return map[this.activeSection] || '';
  }

  openReviewModal(p: any) { this.reviewingPurchase = p; this.reviewForm = { rating: 0, comment: '' }; this.reviewModalOpen = true; }
  closeReviewModal(event?: any) { this.reviewModalOpen = false; }

  submitReview() {
    if (this.reviewForm.rating === 0) return;
    if (this.reviewingPurchase) this.reviewingPurchase.reviewed = true;
    alert('Recenzija objavljena!');
    this.reviewModalOpen = false;
  }

  saveProfile() { Object.assign(this.buyer, this.editBuyer); alert('Profil sačuvan.'); }

  uploadAvatar() {
    const url = prompt('Unesite putanju do slike:', 'assets/images/avatars/');
    if (url) { this.buyer.avatarUrl = url; this.editBuyer.avatarUrl = url; }
  }

  openAccessibility() { alert('Accessibility panel – implementirati u Fazi 2'); }
}
