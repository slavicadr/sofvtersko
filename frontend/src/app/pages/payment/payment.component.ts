import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DonacijaService } from '../../core/services/donacija.service';
import { KupovinaService } from '../../core/services/kupovina.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() logoPath: string = 'assets/logoFinally.jpg';

  orderTitle = 'Online Poduka – Matematika';
  orderAmount = 20;
  beneficiaryName = '';
  beneficiaryId = 0;
  serviceId = 0;
  orderImageUrl = '';
  isDonation = false;

  contactName = '';
  contactEmail = '';
  contactPhone = '';

  isAnonymous = false;

  paymentMethod = 'card';
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';
  cardName = '';
  saveCard = false;

  promoCode = '';
  promoApplied = false;
  discountAmount = 0;

  get finalAmount(): number {
    return this.promoApplied ? this.orderAmount * 0.9 : this.orderAmount;
  }

  isProcessing = false;
  paymentFailed = false;
  failureReason = '';
  validationErrors: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private donacijaService: DonacijaService,
    private kupovinaService: KupovinaService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.contactName = `${user.ime} ${user.prezime}`;
      this.contactEmail = user.email;
      this.contactPhone = user.telefon ?? '';
    }

    this.route.queryParams.subscribe(params => {
      if (params['title']) this.orderTitle = params['title'];
      if (params['price']) this.orderAmount = +params['price'];
      if (params['beneficiary']) this.beneficiaryName = params['beneficiary'];
      if (params['beneficiaryId']) this.beneficiaryId = +params['beneficiaryId'];
      if (params['serviceId']) this.serviceId = +params['serviceId'];
      if (params['amount']) this.orderAmount = +params['amount'];
      if (params['type'] === 'donation') {
        this.isDonation = true;
        this.orderTitle = 'Direktna Donacija';
      }
      if (params['anonymous'] === 'true') this.isAnonymous = true;
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

  private mapNacinPlacanja(): string {
    const map: any = { card: 'KARTICA', paypal: 'PAYPAL', googlepay: 'GOOGLE_PAY', applepay: 'APPLE_PAY' };
    return map[this.paymentMethod] ?? 'KARTICA';
  }

  validate(): boolean {
    this.validationErrors = [];
    return true;
  }

  processPayment() {
    this.isProcessing = true;
    this.paymentFailed = false;

    const user = this.auth.currentUser;

    if (!user && !this.isDonation) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isDonation) {
      this.donacijaService.create({
        donatorId: user?.korisnikId ?? null,
        pomocId: this.beneficiaryId || 1,
        iznos: this.finalAmount,
        nacinPlacanja: this.mapNacinPlacanja(),
        anonimno: this.isAnonymous
      }).subscribe({
        next: (d) => this.onSuccess('DON-' + d.donacijaId),
        error: (err) => this.onError(err)
      });
    } else {
      this.kupovinaService.kupi({
        kupacId: user!.korisnikId,
        uslugaId: this.serviceId,
        pomocId: this.beneficiaryId || 1,
        nacinPlacanja: this.mapNacinPlacanja()
      }).subscribe({

        next: (k) => this.onSuccess('KUP-' + k.kupovinaId),
        error: (err) => this.onError(err)
      });
    }
  }

  private onSuccess(txId: string) {
    this.isProcessing = false;
    this.router.navigate(['/hvala'], {
      queryParams: {
        transactionId: txId,
        amount: this.finalAmount,
        beneficiary: this.beneficiaryName,
        isDonation: this.isDonation
      }
    });
  }

  private onError(err?: any) {
    this.isProcessing = false;
    this.paymentFailed = true;
    if (err?.status === 403) {
      this.failureReason = 'Nemate pravo pristupa. Provjerite da li ste prijavljeni.';
    } else if (err?.status === 401) {
      this.failureReason = 'Sesija je istekla. Prijavite se ponovo.';
    } else if (typeof err?.error === 'string' && err.error.length < 200) {
      this.failureReason = err.error;
    } else {
      this.failureReason = 'Plaćanje nije uspjelo. Molimo pokušajte ponovo.';
    }
  }

  get isLoggedIn(): boolean { return this.auth.isLoggedIn; }

  retryPayment() {
    this.paymentFailed = false;
    this.cardNumber = '';
    this.cardCvc = '';
    this.cardExpiry = '';
  }

  goHome() { this.router.navigate(['/']); }
}
