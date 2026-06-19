import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var paypal: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  // 2. UBACUJEMO IH U IMPORTS NIZ DA BI HTML ZNAO ZA NJIH:
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  // 3. MIJENJAMO EKSTENZIJU IZ .css U .scss JER VAM JE PROJEKAT TAKO PODEŠEN:
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {

  // --- Podaci povezani sa HTML-om preko [(ngModel)] ---
  orderTitle: string = 'Online Mentorska Sesija';
  orderAmount: number = 50.00;
  discountAmount: number = 0;
  finalAmount: number = 50.00;
  orderImageUrl: string = '';

  beneficiaryName: string = 'Slaven M.';
  primalacEmail: string = 'sb-u6i2o48293292@business.example.com';

  promoCode: string = '';
  promoApplied: boolean = false;
  isAnonymous: boolean = false;

  // Kontakt podaci
  isLoggedIn: boolean = true;
  contactName: string = 'Isidora Mujović';
  contactEmail: string = 'isidora@example.com';
  contactPhone: string = '+38268XXXXXX';

  // Kartična polja
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvc: string = '';
  cardName: string = '';
  saveCard: boolean = false;

  // Kontrola stanja ekrana i validacije
  _paymentMethod: string = 'card';
  isProcessing: boolean = false;
  paymentFailed: boolean = false;
  failureReason: string = '';
  validationErrors: string[] = [];

  isDonation: boolean = false;
  logoPath: string = '';
  private paypalButtonRendered: boolean = false;

  private backendUrl = 'http://localhost:8080/api/payment';

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['iznos']) {
        this.orderAmount = Number(params['iznos']);
        this.finalAmount = this.orderAmount;
      }
      if (params['tip'] === 'donacija') {
        this.isDonation = true;
      }
    });

    if (!this.isDonation && !this.isLoggedIn) {
      alert('Greška: Morate biti ulogovani da biste kupili uslugu ili proizvod!');
      this.router.navigate(['/login']);
    }
  }

  get paymentMethod(): string {
    return this._paymentMethod;
  }

  set paymentMethod(value: string) {
    if (this._paymentMethod === value) return;
    this._paymentMethod = value;
    this.validationErrors = [];
    this.paypalButtonRendered = false;

    if (value === 'paypal') {
      setTimeout(() => {
        this.renderPaypalButton();
      }, 500);
    }
  }

  applyPromo() {
    if (this.promoCode.toLowerCase() === 'dobrobit10' && !this.promoApplied) {
      this.promoApplied = true;
      this.discountAmount = this.orderAmount * 0.10;
      this.finalAmount = this.orderAmount - this.discountAmount;
    } else {
      alert('Nevalidan promo kod.');
    }
  }

  formatCardNumber(event: any) {
    let v = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      this.cardNumber = parts.join(' ');
    } else {
      this.cardNumber = v;
    }
  }

  formatExpiry(event: any) {
    let v = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      this.cardExpiry = v.substring(0, 2) + ' / ' + v.substring(2, 4);
    } else {
      this.cardExpiry = v;
    }
  }

  processPayment() {
    this.validationErrors = [];

    if (this.paymentMethod === 'card') {
      if (!this.cardNumber || this.cardNumber.length < 19) this.validationErrors.push('Broj kartice nije validan.');
      if (!this.cardExpiry) this.validationErrors.push('Unesite datum isteka kartice.');
      if (this.cardCvc.length < 3) this.validationErrors.push('CVC mora imati 3 cifre.');
      if (!this.cardName) this.validationErrors.push('Unesite ime vlasnika kartice.');

      if (this.validationErrors.length > 0) return;

      this.isProcessing = true;

      setTimeout(() => {
        this.isProcessing = false;
        alert('Plaćanje karticom uspješno izvršeno kroz simulaciju sigurnog procesora!');
        this.router.navigate([this.isDonation ? '/humanitarni-slucajevi' : '/dashboard/moje-kupovine']);
      }, 2000);
    }
    else if (this.paymentMethod === 'paypal') {
      alert('Molimo koristite žuto PayPal dugme ispod teksta za završetak plaćanja.');
    }
  }

  renderPaypalButton() {
    if (this.paypalButtonRendered) {
      console.log('[PayPal] Dugme već renderovano, preskačem');
      return;
    }

    if (typeof paypal === 'undefined') {
      console.error('[PayPal] SDK nije učitan');
      this.showFailureState('PayPal SDK nije dostupan. Osvježite stranicu (Ctrl+Shift+R).');
      return;
    }

    const container = document.getElementById('paypal-button-container');
    if (!container) {
      console.error('[PayPal] Container element nije pronađen');
      return;
    }
    container.innerHTML = '';
    this.paypalButtonRendered = true;

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        console.log('[PayPal] createOrder pozvan, iznos:', this.finalAmount);
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: this.finalAmount.toFixed(2)
            }
          }]
        });
      },

      onApprove: (data: any, actions: any) => {
        this.isProcessing = true;
        const orderId = data.orderID;
        console.log('[PayPal] onApprove, orderID:', orderId);
        const url = `${this.backendUrl}/capture/${orderId}?iznos=${this.finalAmount}&ponudaId=1&primalacEmail=${this.primalacEmail}`;

        return fetch(url, { method: 'POST' })
            .then(res => {
              this.isProcessing = false;
              if (res.ok) {
                console.log('[PayPal] Capture uspješan');
                alert('Uplata preko PayPal-a uspješno evidentirana!');
                this.router.navigate([this.isDonation ? '/humanitarni-slucajevi' : '/dashboard/moje-kupovine']);
              } else {
                this.showFailureState('Uplata nije zavedena u bazi podataka.');
              }
            })
            .catch(err => {
              this.isProcessing = false;
              console.error('[PayPal] capture greška:', err);
              this.showFailureState('Mrežna greška pri komunikaciji sa serverom.');
            });
      },

      onError: (err: any) => {
        console.error('[PayPal] onError:', err);
        this.showFailureState('PayPal greška: ' + (err?.message || 'Nepoznata greška'));
      }
    }).render('#paypal-button-container')
      .catch((err: any) => {
        console.error('[PayPal] render greška:', err);
        this.paypalButtonRendered = false;
        this.showFailureState('Nije moguće učitati PayPal dugme. Pokušajte ponovo.');
      });
  }

  showFailureState(reason: string) {
    this.paymentFailed = true;
    this.failureReason = reason;
  }

  retryPayment() {
    this.paymentFailed = false;
    this.paymentMethod = 'card';
  }

  goHome() {
    this.router.navigate(['/']);
  }
}