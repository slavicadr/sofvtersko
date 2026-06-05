import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

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

  cases = [
    {
      id: 1, name: 'Petar Stojanović', category: 'Medicinska pomoć',
      description: 'Troškovi terapije. Petru je potrebna fizioterapija i medicinska podrška nakon teške nesreće.',
      fullDescription: 'Petar Stojanović, 42 godine, pretrpio je ozbiljnu povredu leđa koja mu onemogućava rad. Neophodni su troškovi fizioterapije, operacije i oporavka koji prelaze mogućnosti porodice.',
      goal: 2500, raised: 1750, imageUrl: '', initials: 'PS',
      volunteers: ['Marko Jovanović', 'Ana Milić'],
      history: [
        { donor: 'Srđan K.', amount: 100, date: '03.06.2026.', anonymous: false },
        { donor: '', amount: 50, date: '02.06.2026.', anonymous: true },
        { donor: 'Jovana R.', amount: 200, date: '01.06.2026.', anonymous: false },
      ]
    },
    {
      id: 2, name: 'Marija Nikolić', category: 'Podrška porodici',
      description: 'Samohrana majka. Marija sama odgaja troje djece i treba podršku zajednice.',
      fullDescription: 'Marija Nikolić je samohrana majka troje djece u dobi od 5, 8 i 12 godina. Nakon gubitka posla, teško pokriva osnovne životne troškove. Svaka donacija joj pomaže da osigura hranu, odjeću i školski materijal za djecu.',
      goal: 4000, raised: 2400, imageUrl: '', initials: 'MN',
      volunteers: ['Petra Lazović'],
      history: [
        { donor: 'Marko M.', amount: 150, date: '02.06.2026.', anonymous: false },
        { donor: '', amount: 100, date: '01.06.2026.', anonymous: true },
      ]
    },
    {
      id: 3, name: 'Maja Luković', category: 'Hitna operacija',
      description: 'Maji je potrebna hitna operacija srca.',
      fullDescription: 'Maja Luković, 58 godina, treba hitnu operaciju srca. Troškovi liječenja prevazilaze finansijske mogućnosti njene porodice. Svaka pomoć je dragocjena.',
      goal: 8000, raised: 2960, imageUrl: '', initials: 'ML',
      volunteers: ['Igor Vuković', 'Nikola Stanić'],
      history: [
        { donor: 'Ana T.', amount: 500, date: '01.06.2026.', anonymous: false },
        { donor: '', amount: 200, date: '30.05.2026.', anonymous: true },
      ]
    },
    {
      id: 4, name: 'Porodica Đurić', category: 'Obnova doma',
      description: 'Požar je uništio cijeli dom porodice Đurić. Potrebna je hitna podrška za smještaj i obnovu.',
      fullDescription: 'Porodica Đurić ostala je bez doma nakon razornog požara u martu 2026. Supružnici sa dvoje djece privremeno su smješteni kod rodbine. Prikupljaju sredstva za obnovu doma.',
      goal: 12000, raised: 7500, imageUrl: '', initials: 'PĐ',
      volunteers: ['Marko Jovanović', 'Ana Milić', 'Petra Lazović'],
      history: [
        { donor: 'Đorđe P.', amount: 1000, date: '03.06.2026.', anonymous: false },
        { donor: '', amount: 500, date: '02.06.2026.', anonymous: true },
        { donor: 'Milica S.', amount: 300, date: '01.06.2026.', anonymous: false },
      ]
    },
  ];

  get totalRaised(): number { return this.cases.reduce((s, c) => s + c.raised, 0); }
  get totalDonors(): number { return this.cases.reduce((s, c) => s + c.history.length, 0); }

  progressPercent(c: any): number { return Math.min(100, Math.round((c.raised / c.goal) * 100)); }

  constructor(private router: Router) {}
  ngOnInit(): void {}

  donateToCase(c: any) { this.selectedCase = c; this.donationAmount = 20; this.showDonationModal = true; }
  closeDonationModal() { this.showDonationModal = false; this.selectedCase = null; }
  openCaseDetails(c: any) { this.selectedCaseDetails = c; }

  confirmDonation() {
    if (!this.donationAmount || this.donationAmount < 1) return;
    this.closeDonationModal();
    this.router.navigate(['/placanje'], {
      queryParams: {
        type: 'donation',
        beneficiary: this.selectedCase?.name,
        amount: this.donationAmount,
        anonymous: this.donorAnonymous
      }
    });
  }

  uploadCasePhoto(c: any) {
    const path = prompt(`Unesite putanju do fotografije za slučaj "${c.name}" (npr. assets/images/beneficiaries/ime.jpg):`);
    if (path) c.imageUrl = path;
  }
}
