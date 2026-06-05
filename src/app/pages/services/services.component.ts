import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';
  @Input() logoWhitePath: string = 'assets/logoFinally.jpg';

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'popular';
  maxPrice = 200;
  viewMode: 'grid' | 'list' = 'grid';
  selectedService: any = null;

  categories = ['Obrazovanje', 'IT', 'Majstorstvo', 'Zdravlje', 'Biznis', 'Jezik', 'Kuhinja', 'Sport'];

  allServices = [
    { id: 1, title: 'Online časovi – Matematika', description: 'Individualna nastava iz matematike za sve uzraste.', category: 'Obrazovanje', type: 'Usluga', price: 20, rating: 4.9, reviewCount: 24, volunteerName: 'Marko Jovanović', volunteerInitials: 'MJ', beneficiary: 'Slaven M.', beneficiaryDesc: 'Liječenje i rehabilitacija', icon: '📚', imageUrl: '', status: 'ACTIVE',
      reviews: [
        { author: 'Srđan K.', rating: 5, comment: 'Odlična nastava, Marko je izvrstan predavač!', date: '02.06.2026.', reply: 'Hvala puno Srđane!' },
        { author: 'Jovana R.', rating: 5, comment: 'Preporučujem svima. Strpljiv i profesionalan.', date: '28.05.2026.', reply: '' }
      ]
    },
    { id: 2, title: 'IT Podrška', description: 'Rješavam tehničke probleme na računarima i mobilnim uređajima. Onnline podrška.', category: 'IT', type: 'Usluga', price: 30, rating: 4.7, reviewCount: 18, volunteerName: 'Ana Milić', volunteerInitials: 'AM', beneficiary: 'Maja L.', beneficiaryDesc: 'Operacija srca', icon: '💻', imageUrl: '', status: 'ACTIVE', reviews: [] },
    { id: 3, title: 'Online konsultovanje', description: 'Savjetovanje za biznis, startup projekte i karijerni razvoj. 45-minutna online sesija.', category: 'Biznis', type: 'Usluga', price: 50, rating: 4.8, reviewCount: 31, volunteerName: 'Igor Vuković', volunteerInitials: 'IV', beneficiary: 'Porodica Đurić', beneficiaryDesc: 'Obnova doma', icon: '💼', imageUrl: '', status: 'ACTIVE', reviews: [] },
    { id: 4, title: 'Popravka Kućnih Aparata', description: 'Popravka veš mašina, frižidera, šporeta i ostalih kućnih aparata. Brzo i povoljno.', category: 'Majstorstvo', type: 'Usluga', price: 25, rating: 4.5, reviewCount: 12, volunteerName: 'Nikola Stanić', volunteerInitials: 'NS', beneficiary: 'Slaven M.', beneficiaryDesc: 'Liječenje i rehabilitacija', icon: '🔧', imageUrl: '', status: 'ACTIVE', reviews: [] },
    { id: 5, title: 'Kurs Meditacije', description: 'Online kurs meditacije i mindfulnessa za početnike i napredne. 8 lekcija uključeno.', category: 'Zdravlje', type: 'Usluga', price: 35, rating: 4.6, reviewCount: 22, volunteerName: 'Ana Milić', volunteerInitials: 'AM', beneficiary: 'Maja L.', beneficiaryDesc: 'Operacija srca', icon: '🧘', imageUrl: '', status: 'ACTIVE', reviews: [] },
    { id: 6, title: 'Domaći Med (500g)', description: 'Prirodni domaći med sa planinskih pašnjaka. Pakovanje 500g, certificiran.', category: 'Kuhinja', type: 'Proizvod', price: 15, rating: 5.0, reviewCount: 8, volunteerName: 'Petra Lazović', volunteerInitials: 'PL', beneficiary: 'Porodica Đurić', beneficiaryDesc: 'Obnova doma', icon: '🍯', imageUrl: '', status: 'ACTIVE', reviews: [] },
    { id: 7, title: 'Lični Trening', description: 'Personalizovani plan treninga i ishrane. 4  online sesije.', category: 'Sport', type: 'Usluga', price: 40, rating: 4.8, reviewCount: 15, volunteerName: 'Marko Jovanović', volunteerInitials: 'MJ', beneficiary: 'Slaven M.', beneficiaryDesc: 'Liječenje i rehabilitacija', icon: '💪', imageUrl: '', status: 'ACTIVE', reviews: [] },
    { id: 8, title: 'Časovi njemačkog jezika', description: 'Za sve nivoe.', category: 'Jezik', type: 'Usluga', price: 10, rating: 4.4, reviewCount: 35, volunteerName: 'Igor Vuković', volunteerInitials: 'IV', beneficiary: 'Porodica Đurić', beneficiaryDesc: 'Obnova doma', icon: '🚗', imageUrl: '', status: 'ACTIVE', reviews: [] },
  ];

  filteredServices: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterServices();
  }

  filterServices() {
    let list = [...this.allServices];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (this.selectedCategory) {
      list = list.filter(s => s.category === this.selectedCategory);
    }
    list = list.filter(s => s.price <= this.maxPrice);

    if (this.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (this.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviewCount - a.reviewCount);

    this.filteredServices = list;
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filterServices();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = 'popular';
    this.maxPrice = 200;
    this.filterServices();
  }

  getStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  }

  openServiceModal(service: any) { this.selectedService = service; }
  closeServiceModal() { this.selectedService = null; }

  buyService(service: any) {
    this.closeServiceModal();
    this.router.navigate(['/placanje'], { queryParams: { serviceId: service.id, title: service.title, price: service.price, beneficiary: service.beneficiary } });
  }

  uploadServiceImage(service: any) {
    const path = prompt(`Unesite putanju do slike za uslugu "${service.title}" (npr. assets/images/offers/naziv.jpg):`);
    if (path) service.imageUrl = path;
  }
}
