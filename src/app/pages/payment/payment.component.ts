import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';

  // Order data from route params
  orderTitle = 'Online Poduka – Matematika';
  orderAmount = 20;
  beneficiaryName = 'Slaven M.';
  orderImageUrl = '';
  isDonation = false;

  // Contact info (from logged-in user in real app)
  contactName = 'Srđan Kadić';
  contactEmail = 'srdjan@email.com';
  contactPhone = '+382 67 000 111';

  // Payment form
  paymentMethod = 'card';
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';
  cardName = '';
  saveCard = false;

  // Promo
  promoCode = '';
  promoApplied = false;
  discountAmount = 0;

  get finalAmount(): number {
    return this.promoApplied ? this.orderAmount * 0.9 : this.orderAmount;
  }

  // State
  isProcessing = false;
  paymentSuccess = false;
  paymentFailed = false;
  failureReason = '';
  transactionId = '';
  validationErrors: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['title']) this.orderTitle = params['title'];
      if (params['price']) this.orderAmount = +params['price'];
      if (params['beneficiary']) this.beneficiaryName = params['beneficiary'];
      if (params['amount']) this.orderAmount = +params['amount'];
      if (params['type'] === 'donation') {
        this.isDonation = true;
        this.orderTitle = 'Direktna Donacija';
      }
    });
  }

  applyPromo() {
    const valid = ['DOBROBIT10', 'POMOC10', 'FIRST10'];
    if (valid.includes(this.promoCode.toUpperCase())) {
      this.promoApplied = true;
      this.discountAmount = this.orderAmount * 0.1;
    } else {
      alert('Nevažeći promo kod.');
    }
  }

  formatCardNumber(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber = val;
    event.target.value = val;
  }

  formatExpiry(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2);
    this.cardExpiry = val;
    event.target.value = val;
  }

  validate(): boolean {
    this.validationErrors = [];
    if (this.paymentMethod === 'card') {
      const num = this.cardNumber.replace(/\s/g, '');
      if (num.length < 16) this.validationErrors.push('Broj kartice mora imati 16 cifara.');
      if (!this.cardExpiry || this.cardExpiry.length < 4) this.validationErrors.push('Unesite datum isteka kartice.');
      if (!this.cardCvc || this.cardCvc.length < 3) this.validationErrors.push('CVC kod mora imati 3 cifre.');
      if (!this.cardName.trim()) this.validationErrors.push('Unesite ime na kartici.');
    }
    // PayPal, Google Pay, Apple Pay – nema dodatnih polja za validaciju
    return this.validationErrors.length === 0;
  }

  processPayment() {
    if (!this.validate()) return;
    this.isProcessing = true;

    // Simulate payment processing
    setTimeout(() => {
      this.isProcessing = false;
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        this.transactionId = 'TRX-' + Date.now().toString().slice(-6);
        this.paymentSuccess = true;
      } else {
        this.paymentFailed = true;
        this.failureReason = 'Plaćanje nije uspjelo. Molimo pokušajte ponovo ili odaberite drugi način plaćanja.';
      }
    }, 2000);
  }

  retryPayment() {
    this.paymentFailed = false;
    this.cardNumber = '';
    this.cardCvc = '';
    this.cardExpiry = '';
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
