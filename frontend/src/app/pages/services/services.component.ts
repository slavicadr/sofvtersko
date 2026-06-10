import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UslugaService } from '../../core/services/usluga.service';

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
  loading = true;
  error = '';

  categories: string[] = [];
  allServices: any[] = [];
  filteredServices: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private uslugaService: UslugaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.searchQuery = params['q'];
    });
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.uslugaService.getAll().subscribe({
      next: (data) => {
        this.allServices = data
          .filter(u => u.statusObjave === 'aktivna')
          .map(u => this.uslugaService.mapToView(u));
        this.categories = [...new Set(this.allServices.map(s => s.category).filter(Boolean))];
        this.loading = false;
        this.filterServices();
      },
      error: () => {
        this.error = 'Greška pri učitavanju usluga.';
        this.loading = false;
      }
    });
  }

  filterServices() {
    let list = [...this.allServices];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    if (this.selectedCategory) list = list.filter(s => s.category === this.selectedCategory);
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

  openServiceModal(service: any) {
    this.selectedService = service;
    // Load reviews for this service
    this.http.get<any[]>(`/api/recenzije/usluga/${service.id}`).subscribe({
      next: (reviews) => {
        service.reviews = reviews.map(r => ({
          author: r.ocjenjivac ? `${r.ocjenjivac.ime} ${r.ocjenjivac.prezime[0]}.` : 'Anonimno',
          stars: r.brojZvjezdica,
          starsDisplay: '★'.repeat(r.brojZvjezdica) + '☆'.repeat(5 - r.brojZvjezdica),
          date: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : '',
          comment: r.komentar ?? '',
          reply: ''
        }));
        if (reviews.length > 0) {
          const avg = reviews.reduce((s, r) => s + r.brojZvjezdica, 0) / reviews.length;
          service.rating = Math.round(avg * 10) / 10;
          service.reviewCount = reviews.length;
        }
      }
    });
    // Load volunteer bio and portfolio
    if (service.volunteerId) {
      this.http.get<any>(`/api/volonter-info/${service.volunteerId}/dashboard`).subscribe({
        next: (info) => {
          service.volunteerBio = info.biografija ?? '';
          service.volunteerPortfolio = info.portfolioLink ?? '';
          service.volunteerCompletedServices = info.brojRealizovanihUsluga ?? 0;
        }
      });
    }
  }

  closeServiceModal() { this.selectedService = null; }

  buyService(service: any) {
    this.closeServiceModal();
    this.router.navigate(['/placanje'], {
      queryParams: {
        serviceId: service.id,
        title: service.title,
        price: service.price,
        beneficiary: service.beneficiary
      }
    });
  }

  uploadServiceImage(service: any) {
    const path = prompt(`Unesite putanju do slike za uslugu "${service.title}":`);
    if (path) service.imageUrl = path;
  }
}
