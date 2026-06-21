import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { KupljenaUslugaService } from '../services/kupljena-usluga.service';
import { UslugaProizvodService } from '../services/usluga-proizvod.service';
import { OcjenaRecenzijaService } from '../services/ocjena-recenzija.service';
import { KategorijaService } from '../services/kategorija.service';
import { NotifikacijaService } from '../services/notifikacija.service';
import { VerifikacijaService, Verifikacija } from '../services/verifikacija.service';
import { AdminService } from '../services/admin.service';
import { Korisnik } from '../models/korisnik.model';
import { KupljenaUsluga } from '../models/kupljena-usluga.model';
import { UslugaProizvod } from '../models/usluga-proizvod.model';
import { OcjenaRecenzija } from '../models/ocjena-recenzija.model';
import { Kategorija } from '../models/kategorija.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  korisnik: Korisnik | null = null;
  aktivnaSekcija: 'profil' | 'cms' = 'profil';
  ucitavaCms = false;

  // Kupac
  kupovine: KupljenaUsluga[] = [];
  mojRecenzije: OcjenaRecenzija[] = [];

  // Volonter
  mojeUsluge: UslugaProizvod[] = [];
  prodaje: KupljenaUsluga[] = [];
  recenzije: OcjenaRecenzija[] = [];
  prosjecnaOcjena = 0;
  kategorije: Kategorija[] = [];

  // Forma za novu/edit uslugu
  uslugaModalOtvoren = false;
  editUsluga: UslugaProizvod | null = null;
  formaUsluga = this.praznaFormaUsluge();

  // Admin
  volonteriNaCekanju: Korisnik[] = [];
  uslugePending: UslugaProizvod[] = [];
  ucitavaAdmin = false;

  // Forma za recenziju (kupac)
  recenzijaModalOtvoren = false;
  ocjenjujeKupovinu: KupljenaUsluga | null = null;
  formaRecenzija = { zvjezdice: 5, komentar: '' };

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
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private kupljenaUslugaSvc: KupljenaUslugaService,
    private uslugaSvc: UslugaProizvodService,
    private recenzijaSvc: OcjenaRecenzijaService,
    private kategorijaSvc: KategorijaService,
    public notifSvc: NotifikacijaService,
    private verifikacijaSvc: VerifikacijaService,
    private adminSvc: AdminService,
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(u => { this.korisnik = u; });
    this.kategorijaSvc.getAll().subscribe(k => { this.kategorije = k; });
  }

  get jeVolonter(): boolean { return this.korisnik?.tipKorisnika === 'volonter'; }
  get jeKupac(): boolean { return this.korisnik?.tipKorisnika === 'kupac'; }
  get jeAdmin(): boolean { return this.korisnik?.tipKorisnika === 'administrator'; }
  get realizovaneCount(): number { return this.kupovine.filter(k => k.statusIsporuke === 'realizovano').length; }
  get ukupnoPrikupljeno(): number { return this.prodaje.filter(p => p.statusIsporuke === 'realizovano').reduce((s, p) => s + (p.iznos ?? 0), 0); }

  onSekcijaChange(ev: CustomEvent) {
    const val = ev.detail.value as 'profil' | 'cms';
    this.aktivnaSekcija = val;
    if (val === 'cms' && this.korisnik) {
      if (this.jeAdmin) this.ucitajAdminCms();
      else this.ucitajCms();
    }
  }

  ucitajCms() {
    if (!this.korisnik) return;
    this.ucitavaCms = true;
    const id = this.korisnik.korisnikId;

    if (this.jeVolonter) {
      forkJoin({
        usluge:   this.uslugaSvc.getByVolonterId(id).pipe(catchError(() => of([]))),
        prodaje:  this.kupljenaUslugaSvc.getByVolonter(id).pipe(catchError(() => of([]))),
        rec:      this.recenzijaSvc.getByVolonter(id).pipe(catchError(() => of([]))),
        prosjek:  this.recenzijaSvc.getProsjecnaOcjena(id).pipe(catchError(() => of({ volonterId: id, prosjecnaOcjena: 0 }))),
      }).subscribe({
        next: (res) => {
          this.mojeUsluge = res.usluge;
          this.prodaje = res.prodaje;
          this.recenzije = res.rec;
          this.prosjecnaOcjena = res.prosjek.prosjecnaOcjena ?? 0;
          this.ucitavaCms = false;
        },
        error: () => { this.ucitavaCms = false; }
      });
    } else if (this.jeKupac) {
      forkJoin({
        kupovine: this.kupljenaUslugaSvc.getByKupac(id).pipe(catchError(() => of([]))),
        rec:      this.recenzijaSvc.getByKupac(id).pipe(catchError(() => of([]))),
      }).subscribe({
        next: (res) => {
          this.kupovine = res.kupovine;
          this.mojRecenzije = res.rec;
          this.ucitavaCms = false;
        },
        error: () => { this.ucitavaCms = false; }
      });
    }
  }

  // ──── ADMIN ────

  ucitajAdminCms() {
    this.ucitavaAdmin = true;
    forkJoin({
      korisnici: this.adminSvc.getNaCekanju().pipe(catchError(() => of([]))),
      usluge:    this.uslugaSvc.getAll().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (res) => {
        // Prikaži sve korisnike na čekanju koji nisu admin
        this.volonteriNaCekanju = (res.korisnici as Korisnik[]).filter(
          k => k.tipKorisnika !== 'administrator'
        );
        this.uslugePending = (res.usluge as UslugaProizvod[]).filter(
          u => u.statusObjave === 'na_cekanju' || u.statusObjave === 'pending'
        );
        this.ucitavaAdmin = false;
      },
      error: () => { this.ucitavaAdmin = false; }
    });
  }

  async odobriKorisnika(k: Korisnik) {
    try {
      await this.adminSvc.odobriKorisnika(k.korisnikId).toPromise();
      await this.toast(`${k.ime} ${k.prezime} je odobren/a. Email poslan.`, 'success');
      this.volonteriNaCekanju = this.volonteriNaCekanju.filter(x => x.korisnikId !== k.korisnikId);
      await this.notifSvc.posaljiObavjestenje('Admin', `Nalog za ${k.ime} ${k.prezime} je odobren.`);
    } catch { await this.toast('Greška pri odobravanju.', 'danger'); }
  }

  async odbijKorisnika(k: Korisnik) {
    const alert = await this.alertCtrl.create({
      header: 'Odbij nalog',
      message: `${k.ime} ${k.prezime} (${k.tipKorisnika})`,
      inputs: [{ name: 'razlog', type: 'textarea', placeholder: 'Razlog odbijanja (opcionalno)' }],
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Odbij', role: 'destructive',
          handler: async (data) => {
            try {
              await this.adminSvc.odbijKorisnika(k.korisnikId, data.razlog ?? '').toPromise();
              await this.toast('Nalog odbijen.', 'warning');
              this.volonteriNaCekanju = this.volonteriNaCekanju.filter(x => x.korisnikId !== k.korisnikId);
            } catch { await this.toast('Greška pri odbijanju.', 'danger'); }
          }
        }
      ]
    });
    await alert.present();
  }

  async odobriUslugu(u: UslugaProizvod) {
    try {
      await this.uslugaSvc.promijeniStatus(u.uslugaProizvodId, 'aktivna').toPromise();
      await this.toast(`Usluga "${u.naziv}" odobrena.`, 'success');
      this.uslugePending = this.uslugePending.filter(x => x.uslugaProizvodId !== u.uslugaProizvodId);
      await this.notifSvc.posaljiObavjestenje('Admin', `Usluga "${u.naziv}" je odobrena.`);
    } catch { await this.toast('Greška pri odobravanju usluge.', 'danger'); }
  }

  async odbijUslugu(u: UslugaProizvod) {
    try {
      await this.uslugaSvc.promijeniStatus(u.uslugaProizvodId, 'odbijen').toPromise();
      await this.toast(`Usluga "${u.naziv}" odbijena.`, 'warning');
      this.uslugePending = this.uslugePending.filter(x => x.uslugaProizvodId !== u.uslugaProizvodId);
    } catch { await this.toast('Greška pri odbijanju usluge.', 'danger'); }
  }

  // ──── VOLONTER: Upravljanje uslugama ────

  praznaFormaUsluge() {
    return { naziv: '', opis: '', cijena: null as number | null, kapacitet: null as number | null, kategorijaId: null as number | null };
  }

  otvoriDodajUslugu() {
    this.editUsluga = null;
    this.formaUsluga = this.praznaFormaUsluge();
    this.uslugaModalOtvoren = true;
  }

  otvoriUrediUslugu(u: UslugaProizvod) {
    this.editUsluga = u;
    this.formaUsluga = {
      naziv: u.naziv,
      opis: u.opis ?? '',
      cijena: u.cijena ?? null,
      kapacitet: u.kapacitet ?? null,
      kategorijaId: u.kategorija?.kategorijaId ?? null,
    };
    this.uslugaModalOtvoren = true;
  }

  async sacuvajUslugu() {
    if (!this.formaUsluga.naziv.trim() || !this.korisnik) return;
    const payload: any = {
      naziv: this.formaUsluga.naziv,
      opis: this.formaUsluga.opis,
      cijena: this.formaUsluga.cijena,
      kapacitet: this.formaUsluga.kapacitet,
      volonter: { korisnikId: this.korisnik.korisnikId },
      kategorija: this.formaUsluga.kategorijaId ? { kategorijaId: this.formaUsluga.kategorijaId } : null,
    };

    try {
      if (this.editUsluga) {
        await this.uslugaSvc.uredi(this.editUsluga.uslugaProizvodId, payload).toPromise();
        await this.toast('Ponuda ažurirana.', 'success');
      } else {
        await this.uslugaSvc.kreiraj(payload).toPromise();
        await this.toast('Ponuda poslana na odobrenje.', 'success');
        await this.notifSvc.posaljiObavjestenje('Nova ponuda', `Vaša ponuda "${payload.naziv}" je poslana na odobrenje.`);
      }
      this.uslugaModalOtvoren = false;
      this.ucitajCms();
    } catch {
      await this.toast('Greška pri čuvanju ponude.', 'danger');
    }
  }

  async obrisiUslugu(u: UslugaProizvod) {
    const alert = await this.alertCtrl.create({
      header: 'Brisanje ponude',
      message: `Da li ste sigurni da želite obrisati "${u.naziv}"?`,
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Obriši', role: 'destructive',
          handler: async () => {
            try {
              await this.uslugaSvc.obrisi(u.uslugaProizvodId).toPromise();
              await this.toast('Ponuda obrisana.', 'success');
              this.ucitajCms();
            } catch {
              await this.toast('Greška pri brisanju.', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ──── KUPAC: Recenzije ────

  imaRecenziju(kupovina: KupljenaUsluga): boolean {
    return this.mojRecenzije.some(r => r.kupovina?.kupovinaId === kupovina.kupovinaId);
  }

  otvoriOcijeni(kupovina: KupljenaUsluga) {
    this.ocjenjujeKupovinu = kupovina;
    this.formaRecenzija = { zvjezdice: 5, komentar: '' };
    this.recenzijaModalOtvoren = true;
  }

  async posaljiRecenziju() {
    if (!this.ocjenjujeKupovinu || !this.korisnik) return;
    try {
      await this.recenzijaSvc.dodajRecenziju(
        this.ocjenjujeKupovinu.kupovinaId,
        this.korisnik.korisnikId,
        this.formaRecenzija.zvjezdice,
        this.formaRecenzija.komentar
      ).toPromise();
      await this.toast('Recenzija poslana. Hvala!', 'success');
      await this.notifSvc.posaljiObavjestenje('Recenzija', 'Vaša recenzija je uspješno objavljena.');
      this.recenzijaModalOtvoren = false;
      this.ucitajCms();
    } catch {
      await this.toast('Greška pri slanju recenzije.', 'danger');
    }
  }

  // ──── Zajedničko ────

  async oznaciRealizovano(kupovina: KupljenaUsluga) {
    try {
      await this.kupljenaUslugaSvc.oznaciRealizovano(kupovina.kupovinaId).toPromise();
      kupovina.statusIsporuke = 'realizovano';
      await this.toast('Označeno kao realizovano.', 'success');
      await this.notifSvc.posaljiObavjestenje('Kupovina', 'Kupovina je označena kao realizovana.');
    } catch {
      await this.toast('Greška pri ažuriranju.', 'danger');
    }
  }

  async toggleNotifikacije() {
    if (this.notifSvc.jeUkljuceno) {
      this.notifSvc.iskljuci();
    } else {
      await this.notifSvc.ukljuci();
    }
  }

  statusLabel(status?: string): string {
    const mapa: Record<string, string> = {
      realizovano: 'Realizovano',
      na_cekanju: 'Čeka isporuku',
      otkazano: 'Otkazano',
    };
    return status ? (mapa[status] ?? status) : 'Plaćeno';
  }

  formatirajDatum(datum?: string): string {
    if (!datum) return '';
    return new Date(datum).toLocaleDateString('sr-Latn', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  zvjezdice(n: number): number[] { return Array.from({ length: Math.round(n) }); }
  praznihZvjezdica(n: number): number[] { return Array.from({ length: 5 - Math.round(n) }); }

  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'bottom' });
    await t.present();
  }

  async onOdjava() {
    const alert = await this.alertCtrl.create({
      header: 'Odjava',
      message: 'Da li ste sigurni da se želite odjaviti?',
      buttons: [
        { text: 'Otkaži', role: 'cancel' },
        {
          text: 'Odjavi se', role: 'destructive',
          handler: () => { this.auth.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true })); }
        },
      ],
    });
    await alert.present();
  }
}
