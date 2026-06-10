import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Korisnik } from '../models/korisnik.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  korisnik: Korisnik | null = null;

  tipLabele: Record<string, string> = {
    donator: 'Donator',
    volonter: 'Volonter',
    kupac: 'Kupac',
    korisnik_pomoci: 'Korisnik koji treba pomoć',
    administrator: 'Administrator',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => this.korisnik = u);
  }

  async onOdjava() {
    const alert = await this.alertCtrl.create({
      header: 'Odjava',
      message: 'Da li ste sigurni da se želite odjaviti?',
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Odjavi se',
          role: 'destructive',
          handler: () => {
            this.auth.logout().subscribe(() => {
              this.router.navigate(['/login'], { replaceUrl: true });
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
