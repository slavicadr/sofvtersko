import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { DonacijaService } from '../../core/services/donacija.service';
import { KorisnikPomociService } from '../../core/services/korisnik-pomoci.service';
import { KupovinaService } from '../../core/services/kupovina.service';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';
  @Input() logoWhitePath: string = 'assets/logoFinally.jpg';

  searchQuery = '';
  filterBeneficiary = '';
  filterType = '';
  loading = true;
  error = '';

  beneficiarySummaries: any[] = [];
  allDonations: any[] = [];
  filteredDonations: any[] = [];

  get totalFiltered(): number { return this.filteredDonations.reduce((s, d) => s + d.amount, 0); }

  constructor(
    private donacijaService: DonacijaService,
    private pomocService: KorisnikPomociService,
    private kupovinaService: KupovinaService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.donacijaService.getAll().subscribe({
      next: (donations) => {
        const donationViews = donations.map(d => this.donacijaService.mapToView(d));

        // Also load service purchases and merge them into the public list
        this.kupovinaService.getAll().subscribe({
          next: (purchases) => {
            const purchaseViews = purchases.map(k => {
              const anonimno = k.donator?.prikazAnonimno;
              const ime = k.donator?.ime ?? '';
              const prez = k.donator?.prezime ?? '';
              return {
                id: 'KUP-' + k.kupovinaId,
                donor: anonimno ? '' : `${ime} ${prez}`.trim(),
                donorInitials: anonimno ? '?' : (ime[0] ?? '') + (prez[0] ?? ''),
                anonymous: anonimno,
                beneficiary: k.korisnikPomoci?.naziv ?? '',
                type: 'Kupovina Usluge',
                description: k.uslugaProizvod?.naziv ?? 'Usluga',
                amount: k.iznos,
                date: k.datumKupovine ? new Date(k.datumKupovine).toLocaleString('bs-BA') : '',
              };
            });

            this.allDonations = [...donationViews, ...purchaseViews]
              .sort((a, b) => (b.date > a.date ? 1 : -1));
            this.loading = false;
            this.filterDonations();
          },
          error: () => {
            this.allDonations = donationViews;
            this.loading = false;
            this.filterDonations();
          }
        });

        // Beneficiary summaries — sum both donations and purchases
        this.kupovinaService.getAll().subscribe({
          next: (purchases) => {
            this.pomocService.getAll().subscribe({
              next: (pomocList) => {
                this.beneficiarySummaries = pomocList.map(p => {
                  const fromDonations = donations
                    .filter(d => d.korisnikPomoci?.pomocId === p.pomocId)
                    .reduce((s, d) => s + Number(d.iznos), 0);
                  const fromPurchases = purchases
                    .filter(k => k.korisnikPomoci?.pomocId === p.pomocId)
                    .reduce((s, k) => s + Number(k.iznos), 0);
                  const total = fromDonations + fromPurchases;
                  return {
                    id: p.pomocId,
                    name: p.naziv,
                    description: p.opisPotrebe,
                    totalRaised: total,
                    goal: 5000,
                    percent: Math.min(100, Math.round((total / 5000) * 100)),
                    imageUrl: '',
                    initials: (p.naziv.split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase()).slice(0, 2),
                    volunteers: []
                  };
                });
              }
            });
          }
        });
      },
      error: () => {
        this.error = 'Greška pri učitavanju donacija.';
        this.loading = false;
      }
    });
  }

  filterDonations() {
    let list = [...this.allDonations];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(d =>
        (!d.anonymous && d.donor.toLowerCase().includes(q)) ||
        d.beneficiary.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }
    if (this.filterBeneficiary) list = list.filter(d => d.beneficiary === this.filterBeneficiary);
    if (this.filterType) list = list.filter(d => d.type === this.filterType);
    this.filteredDonations = list;
  }
}
