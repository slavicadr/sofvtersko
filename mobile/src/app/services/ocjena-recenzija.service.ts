import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OcjenaRecenzija } from '../models/ocjena-recenzija.model';

@Injectable({ providedIn: 'root' })
export class OcjenaRecenzijaService {
  private readonly baseUrl = `${environment.apiUrl}/api/recenzije`;

  constructor(private http: HttpClient) {}

  getByVolonter(volonterId: number): Observable<OcjenaRecenzija[]> {
    return this.http.get<OcjenaRecenzija[]>(`${this.baseUrl}/volonter/${volonterId}`, { withCredentials: true });
  }

  getProsjecnaOcjena(volonterId: number): Observable<{ volonterId: number; prosjecnaOcjena: number }> {
    return this.http.get<{ volonterId: number; prosjecnaOcjena: number }>(
      `${this.baseUrl}/volonter/${volonterId}/prosjek`,
      { withCredentials: true }
    );
  }

  getByKupac(kupacId: number): Observable<OcjenaRecenzija[]> {
    return this.http.get<OcjenaRecenzija[]>(`${this.baseUrl}/kupac/${kupacId}`, { withCredentials: true });
  }

  dodajRecenziju(kupovinaId: number, kupacId: number, brojZvjezdica: number, komentar: string): Observable<OcjenaRecenzija> {
    return this.http.post<OcjenaRecenzija>(`${this.baseUrl}/dodaj`, { kupovinaId, kupacId, brojZvjezdica, komentar }, { withCredentials: true });
  }
}
