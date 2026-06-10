import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donacija } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DonacijaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Donacija[]> {
    return this.http.get<Donacija[]>('/api/donacije');
  }

  create(data: { donatorId: number | null; pomocId: number; iznos: number; nacinPlacanja: string; anonimno?: boolean }): Observable<Donacija> {
    return this.http.post<Donacija>('/api/donacije', data);
  }

  mapToView(d: Donacija): any {
    const anonimno = d.anonimno || !d.donator || d.donator.prikazAnonimno;
    const ime = d.donator?.ime ?? '';
    const prez = d.donator?.prezime ?? '';
    return {
      id: d.donacijaId,
      donor: anonimno ? '' : `${ime} ${prez}`.trim(),
      donorInitials: anonimno ? '?' : (ime[0] ?? '') + (prez[0] ?? ''),
      anonymous: anonimno,
      beneficiary: d.korisnikPomoci?.naziv ?? '',
      type: 'Direktna',
      description: 'Direktna donacija',
      amount: d.iznos,
      date: d.datumDonacije
        ? new Date(d.datumDonacije).toLocaleString('bs-BA')
        : '',
    };
  }
}
