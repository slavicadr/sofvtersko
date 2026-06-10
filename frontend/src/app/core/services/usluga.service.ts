import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UslugaProizvod } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UslugaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<UslugaProizvod[]> {
    return this.http.get<UslugaProizvod[]>('/api/usluge-proizvodi');
  }

  filterByKategorija(kategorijaId: number): Observable<UslugaProizvod[]> {
    return this.http.post<UslugaProizvod[]>('/api/usluge-proizvodi/filter-kategorija', { kategorijaId });
  }

  filterByVolonter(korisnikId: number): Observable<UslugaProizvod[]> {
    return this.http.post<UslugaProizvod[]>('/api/usluge-proizvodi/filter-volonter', { korisnikId });
  }

  create(data: any): Observable<UslugaProizvod> {
    return this.http.post<UslugaProizvod>('/api/usluge-proizvodi', data);
  }

  updateStatus(id: number, noviStatus: string): Observable<UslugaProizvod> {
    return this.http.patch<UslugaProizvod>(`/api/usluge-proizvodi/${id}/status`, null, {
      params: { noviStatus }
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`/api/usluge-proizvodi/${id}`, { responseType: 'text' });
  }

  mapToView(u: UslugaProizvod): any {
    const ime = u.volonter?.ime ?? '';
    const prez = u.volonter?.prezime ?? '';
    return {
      id: u.uslugaProizvodId,
      title: u.naziv,
      description: u.opis,
      category: u.kategorija?.naziv ?? '',
      type: u.tip === 'usluga' ? 'Usluga' : 'Proizvod',
      price: u.cijena,
      rating: 0,
      reviewCount: 0,
      volunteerId: u.volonter?.korisnikId ?? 0,
      volunteerName: `${ime} ${prez}`.trim(),
      volunteerInitials: (ime[0] ?? '') + (prez[0] ?? ''),
      volunteerBio: '',
      volunteerPortfolio: '',
      beneficiary: '',
      beneficiaryDesc: '',
      status: u.statusObjave === 'aktivna' ? 'ACTIVE' : u.statusObjave === 'popunjeno' ? 'FULL' : 'PENDING',
      isFull: u.statusObjave === 'popunjeno',
      kapacitet: u.kapacitet ?? null,
      reviews: [],
      imageUrl: '',
      icon: '🛠',
    };
  }
}
