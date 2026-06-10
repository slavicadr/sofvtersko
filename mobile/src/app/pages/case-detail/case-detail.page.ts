import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { KorisnikPomociService } from '../../services/korisnik-pomoci.service';
import { DonacijaService } from '../../services/donacija.service';
import { AuthService } from '../../services/auth.service';
import { KorisnikPomoci } from '../../models/korisnik-pomoci.model';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.page.html',
  styleUrls: ['./case-detail.page.scss'],
  standalone: false,
})
export class CaseDetailPage implements OnInit {
  slucaj: KorisnikPomoci | null = null;
  donacijaForm: FormGroup;
  ucitava = true;

  naciniPlacanja = ['KARTICA', 'PAYPAL', 'TRANSFER'];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private korisnikPomociSvc: KorisnikPomociService,
    private donacijaSvc: DonacijaService,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.donacijaForm = this.fb.group({
      iznos: [null, [Validators.required, Validators.min(1)]],
      nacinPlacanja: ['KARTICA', Validators.required],
      anonimno: [false],
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.korisnikPomociSvc.getById(id).subscribe({
      next: (data) => {
        this.slucaj = data;
        this.ucitava = false;
      },
      error: () => { this.ucitava = false; },
    });
  }

  async onDoniraj() {
    if (this.donacijaForm.invalid || !this.slucaj) return;
    const loading = await this.loadingCtrl.create({ message: 'Slanje donacije...' });
    await loading.present();

    const { iznos, nacinPlacanja, anonimno } = this.donacijaForm.value;
    const donatorId = this.auth.currentUser?.korisnikId ?? null;

    this.donacijaSvc.doniraj({
      donatorId,
      pomocId: this.slucaj.pomocId,
      iznos,
      nacinPlacanja,
      anonimno,
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Hvala!',
          message: `Vaša donacija od ${iznos} KM je uspješno poslata.`,
          buttons: ['OK'],
        });
        await alert.present();
        this.donacijaForm.reset({ nacinPlacanja: 'KARTICA', anonimno: false });
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: err.error || 'Donacija nije uspjela.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
