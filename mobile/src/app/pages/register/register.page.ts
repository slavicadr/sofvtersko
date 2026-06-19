import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  form: FormGroup;

  tipovi = [
    { label: 'Kupac', value: 'kupac' },
    { label: 'Volonter', value: 'volonter' },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lozinkaHash: ['', [Validators.required, Validators.minLength(6)]],
      telefon: [''],
      adresa: [''],
      tipKorisnika: ['kupac', Validators.required],
    });
  }

  async onRegister() {
    if (this.form.invalid) return;
    const loading = await this.loadingCtrl.create({ message: 'Registracija...' });
    await loading.present();

    const data = this.form.value;
    const isKupac = data.tipKorisnika === 'kupac';
    const request$ = isKupac ? this.auth.registerKupac(data) : this.auth.register(data);

    request$.subscribe({
      next: async () => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Uspješno',
          message: 'Nalog je kreiran. Provjerite email za potvrdu.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/login'], { replaceUrl: true }) }],
        });
        await alert.present();
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: err.error || 'Registracija nije uspjela.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
