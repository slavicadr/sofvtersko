import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UslugaService } from '../../core/services/usluga.service';

@Component({
  selector: 'app-volonter-profil',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './volonter-profil.component.html',
  styleUrls: ['./volonter-profil.component.scss']
})
export class VolonterProfilComponent implements OnInit {
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  volonterId = 0;
  volonter: any = null;
  dashboard: any = null;
  usluge: any[]    = [];
  recenzije: any[] = [];
  prosjecnaOcjena  = 0;
  loading = true;
  error   = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private uslugaService: UslugaService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.volonterId = +p['id'];
      this.ucitajSve();
    });
  }

  ucitajSve() {
    this.loading = true;

    // 1. Dashboard volontera (bio, portfolio, stats)
    this.http.get<any>(`/api/volonter-info/${this.volonterId}/dashboard`).subscribe({
      next: (d) => {
        this.dashboard = d;
        this.volonter = d.volonter ?? d;
        this.loading = false;
      },
      error: () => { this.error = 'Profil volontera nije pronađen.'; this.loading = false; }
    });

    // 2. Aktivne usluge volontera
    this.http.get<any[]>(`/api/usluge-proizvodi/volonter/${this.volonterId}`).subscribe({
      next: (data) => {
        this.usluge = data
          .filter(u => u.statusObjave === 'aktivna')
          .map(u => this.uslugaService.mapToView(u));
      }
    });

    // 3. Recenzije volontera
    this.http.get<any[]>(`/api/recenzije/volonter/${this.volonterId}`).subscribe({
      next: (data) => {
        this.recenzije = data.map(r => ({
          autor: r.ocjenjivac ? `${r.ocjenjivac.ime} ${r.ocjenjivac.prezime[0]}.` : 'Anonimno',
          zvjezdice: r.brojZvjezdica,
          prikaz: '★'.repeat(r.brojZvjezdica) + '☆'.repeat(5 - r.brojZvjezdica),
          datum: r.datumOcjene ? new Date(r.datumOcjene).toLocaleDateString('bs-BA') : '',
          komentar: r.komentar ?? '',
          uslugaNaziv: r.uslugaProizvod?.naziv ?? ''
        }));
      }
    });

    // 4. Prosječna ocjena
    this.http.get<any>(`/api/recenzije/volonter/${this.volonterId}/prosjek`).subscribe({
      next: (d) => { this.prosjecnaOcjena = d.prosjecnaOcjena ?? 0; }
    });
  }

  kupiUslugu(usluga: any) {
    this.router.navigate(['/placanje'], {
      queryParams: { serviceId: usluga.id, title: usluga.title, price: usluga.price }
    });
  }

  zvjezdicePrikaz(n: number): string {
    const f = Math.round(n);
    return '★'.repeat(f) + '☆'.repeat(5 - f);
  }
}
