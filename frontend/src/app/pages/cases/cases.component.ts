import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { KorisnikPomociService } from '../../core/services/korisnik-pomoci.service';
import { DonacijaService } from '../../core/services/donacija.service';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';
  @Input() logoWhitePath: string = 'assets/logoFinally.jpg';

  showDonationModal = false;
  selectedCase: any = null;
  selectedCaseDetails: any = null;
  donationAmount: number = 20;
  donorAnonymous = false;
  loading = true;
  error = '';

  cases: any[] = [];

  get totalRaised(): number { return this.cases.reduce((s, c) => s + c.raised, 0); }
  get totalDonors(): number { return this.cases.reduce((s, c) => s + c.history.length, 0); }

  progressPercent(c: any): number {
    return Math.min(100, Math.round((c.raised / c.goal) * 100));
  }

  constructor(
    private router: Router,
    private pomocService: KorisnikPomociService,
    private donacijaService: DonacijaService
  ) {}

  ngOnInit(): void {
    this.pomocService.getAll().subscribe({
      next: (data) => {
        this.cases = data.map(p => this.pomocService.mapToView(p));
        this.loading = false;
        this.loadDonations();
      },
      error: () => {
        this.error = 'Greška pri učitavanju slučajeva.';
        this.loading = false;
      }
    });
  }

  loadDonations() {
    this.donacijaService.getAll().subscribe({
      next: (donations) => {
        donations.forEach(d => {
          const c = this.cases.find(c => c.id === d.korisnikPomoci?.pomocId);
          if (c) {
            c.raised += d.iznos;
            const anon = d.anonimno || d.donator?.prikazAnonimno;
            c.history.push({
              donor: anon ? '' : `${d.donator?.ime ?? ''} ${d.donator?.prezime ?? ''}`.trim(),
              amount: d.iznos,
              date: d.datumDonacije ? new Date(d.datumDonacije).toLocaleDateString('bs-BA') : '',
              anonymous: anon
            });
          }
        });
        this.cases.forEach(c => {
          c.percent = Math.min(100, Math.round((c.raised / c.goal) * 100));
        });
      }
    });
  }

  donateToCase(c: any) { this.selectedCase = c; this.donationAmount = 20; this.showDonationModal = true; }
  closeDonationModal() { this.showDonationModal = false; this.selectedCase = null; }
  openCaseDetails(c: any) { this.selectedCaseDetails = c; }

  confirmDonation() {
    if (!this.donationAmount || this.donationAmount < 1) return;
    this.closeDonationModal();
    this.router.navigate(['/placanje'], {
      queryParams: {
        type: 'donation',
        beneficiaryId: this.selectedCase?.id,
        beneficiary: this.selectedCase?.name,
        amount: this.donationAmount,
        anonymous: this.donorAnonymous
      }
    });
  }

  uploadCasePhoto(c: any) {
    const path = prompt(`Unesite putanju do fotografije za slučaj "${c.name}":`);
    if (path) c.imageUrl = path;
  }
}
