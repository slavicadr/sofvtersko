import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      lozinka: ['', Validators.required],
    });
  }

  async onLogin() {
    if (this.form.invalid) return;
    const loading = await this.loadingCtrl.create({ message: 'Prijava...' });
    await loading.present();
    const { email, lozinka } = this.form.value;
    this.auth.login(email, lozinka).subscribe({
      next: async () => {
        await loading.dismiss();
        this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: err.error || 'Pogrešni podaci za prijavu.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
