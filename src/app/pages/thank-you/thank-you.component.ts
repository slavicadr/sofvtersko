import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';
  @Input() logoWhitePath: string = 'assets/logoFinally.jpg';

  // Passed via query params from payment page
  transactionId = '';
  amount = 0;
  beneficiaryName = '';
  donationDate = '';

  // UI state
  linkCopied = false;

  // Platform stats (in a real app, fetch from backend)
  totalDonors = 142;
  totalRaised = 16060;
  activeCases = 4;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.transactionId = params['transactionId'] || ('TRX-' + Date.now().toString().slice(-6));
      this.amount        = params['amount'] ? +params['amount'] : 0;
      this.beneficiaryName = params['beneficiary'] || '';
    });

    const now = new Date();
    this.donationDate = now.toLocaleDateString('bs-BA', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  goToDonations() {
    this.router.navigate(['/donacije']);
  }

  donatAgain() {
    this.router.navigate(['/donacije']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.origin + '/donacije');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnWhatsapp() {
    const text = encodeURIComponent('Upravo sam donirao/la na platformi Dobrobit i pomogao/la nekome kome je pomoć potrebna. Pridružite se i vi! ' + window.location.origin);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.origin + '/donacije').then(() => {
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2500);
    });
  }
}
