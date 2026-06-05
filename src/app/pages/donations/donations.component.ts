import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

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

  beneficiarySummaries = [
    { name: 'Slaven M.', description: 'Liječenje i rehabilitacija', totalRaised: 3200, goal: 5000, percent: 64, imageUrl: '', initials: 'SM', volunteers: ['Marko Jovanović', 'Ana Milić'] },
    { name: 'Maja L.', description: 'Operacija srca', totalRaised: 2960, goal: 8000, percent: 37, imageUrl: '', initials: 'ML', volunteers: ['Igor Vuković', 'Nikola Stanić'] },
    { name: 'Porodica Đurić', description: 'Obnova doma nakon požara', totalRaised: 7500, goal: 12000, percent: 63, imageUrl: '', initials: 'PĐ', volunteers: ['Marko Jovanović', 'Ana Milić', 'Petra Lazović'] },
    { name: 'Marija Nikolić', description: 'Podrška porodici', totalRaised: 2400, goal: 4000, percent: 60, imageUrl: '', initials: 'MN', volunteers: ['Petra Lazović'] },
  ];

  allDonations = [
    { id: 1, donor: 'Srđan Kadić', donorInitials: 'SK', anonymous: false, beneficiary: 'Slaven M.', type: 'Kupovina', description: 'Online časovi matematike', amount: 20, date: '03.06.2026. 09:14' },
    { id: 2, donor: '', donorInitials: '?', anonymous: true, beneficiary: 'Maja L.', type: 'Direktna', description: 'Direktna donacija', amount: 50, date: '02.06.2026. 15:30' },
    { id: 3, donor: 'Aleksandar Plamenac', donorInitials: 'AP', anonymous: false, beneficiary: 'Porodica Đurić', type: 'Direktna', description: 'Direktna donacija', amount: 200, date: '02.06.2026. 12:00' },
    { id: 4, donor: 'Savo Tomović.', donorInitials: 'ST', anonymous: false, beneficiary: 'Slaven M.', type: 'Direktna', description: 'Direktna donacija', amount: 100, date: '01.06.2026. 14:10' },
    { id: 5, donor: '', donorInitials: '?', anonymous: true, beneficiary: 'Maja L.', type: 'Kupovina', description: 'Online časovi matematike', amount: 20, date: '01.06.2026. 09:05' },
    { id: 6, donor: 'Savo Tomović', donorInitials: 'ST', anonymous: false, beneficiary: 'Porodica Đurić', type: 'Direktna', description: 'Direktna donacija', amount: 1000, date: '03.06.2026. 08:20' },
    { id: 7, donor: 'Kosta Pavlović', donorInitials: 'KP', anonymous: false, beneficiary: 'Maja L.', type: 'Direktna', description: 'Direktna donacija', amount: 500, date: '01.06.2026. 11:45' },
    { id: 8, donor: 'Isidora Mujović', donorInitials: 'MS', anonymous: false, beneficiary: 'Porodica Đurić', type: 'Kupovina', description: 'IT Podrška', amount: 30, date: '30.05.2026. 16:00' },
    { id: 9, donor: '', donorInitials: '?', anonymous: true, beneficiary: 'Marija Nikolić', type: 'Direktna', description: 'Direktna donacija', amount: 100, date: '29.05.2026. 10:30' },
    { id: 10, donor: 'Slavica Drobnjak', donorInitials: 'SD', anonymous: false, beneficiary: 'Marija Nikolić', type: 'Kupovina', description: 'Kurs Meditacije', amount: 35, date: '28.05.2026. 14:15' },
  ];

  filteredDonations: any[] = [];

  get totalFiltered(): number { return this.filteredDonations.reduce((s, d) => s + d.amount, 0); }

  ngOnInit(): void { this.filterDonations(); }

  filterDonations() {
    let list = [...this.allDonations];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(d => (!d.anonymous && d.donor.toLowerCase().includes(q)) || d.beneficiary.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    if (this.filterBeneficiary) list = list.filter(d => d.beneficiary === this.filterBeneficiary);
    if (this.filterType) list = list.filter(d => d.type === this.filterType);
    this.filteredDonations = list;
  }
}
