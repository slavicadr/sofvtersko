import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotifikacijaService {
  private _ukljucene = new BehaviorSubject<boolean>(
    localStorage.getItem('push_notif') === 'true'
  );
  ukljucene$ = this._ukljucene.asObservable();

  constructor(private toastCtrl: ToastController) {}

  get jeUkljuceno(): boolean {
    return this._ukljucene.value;
  }

  async ukljuci(): Promise<boolean> {
    if (!('Notification' in window)) {
      await this.prikaziToast('Vaš pretraživač ne podržava obavještenja.', 'warning');
      return false;
    }
    let dozvola = Notification.permission;
    if (dozvola === 'default') {
      dozvola = await Notification.requestPermission();
    }
    if (dozvola === 'granted') {
      this._ukljucene.next(true);
      localStorage.setItem('push_notif', 'true');
      await this.prikaziToast('Push obavještenja su uključena!', 'success');
      return true;
    } else {
      await this.prikaziToast('Dozvola za obavještenja je odbijena. Omogućite je u postavkama pretraživača.', 'warning');
      return false;
    }
  }

  iskljuci() {
    this._ukljucene.next(false);
    localStorage.setItem('push_notif', 'false');
  }

  async posaljiObavjestenje(naslov: string, tekst: string, ikona = 'assets/icon/favicon.png') {
    if (!this.jeUkljuceno) return;

    // Browser native notification
    if (Notification.permission === 'granted') {
      const notif = new Notification(naslov, { body: tekst, icon: ikona });
      setTimeout(() => notif.close(), 5000);
    }

    // Uvijek prikaži in-app toast
    await this.prikaziToast(`${naslov}: ${tekst}`, 'primary', 4000);
  }

  private async prikaziToast(message: string, color = 'dark', duration = 3000) {
    const toast = await this.toastCtrl.create({ message, duration, color, position: 'top' });
    await toast.present();
  }
}
