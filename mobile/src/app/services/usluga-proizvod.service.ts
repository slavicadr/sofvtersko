import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UslugaProizvod } from '../models/usluga-proizvod.model';
import { Korisnik } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class UslugaProizvodService {
  private readonly baseUrl = `${environment.apiUrl}/api/usluge-proizvodi`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UslugaProizvod[]> {
    return this.http.get<UslugaProizvod[]>(this.baseUrl, { withCredentials: true });
  }

  getById(id: number): Observable<UslugaProizvod> {
    return this.http.get<UslugaProizvod>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  getByVolonter(volonter: Korisnik): Observable<UslugaProizvod[]> {
    return this.http.post<UslugaProizvod[]>(`${this.baseUrl}/filter-volonter`, volonter, { withCredentials: true });
  }

  getByVolonterId(volonterId: number): Observable<UslugaProizvod[]> {
    return this.http.get<UslugaProizvod[]>(`${this.baseUrl}/volonter/${volonterId}`, { withCredentials: true });
  }

  kreiraj(usluga: Partial<UslugaProizvod>): Observable<UslugaProizvod> {
    return this.http.post<UslugaProizvod>(this.baseUrl, usluga, { withCredentials: true });
  }

  promijeniStatus(id: number, noviStatus: string): Observable<UslugaProizvod> {
    const params = new HttpParams().set('noviStatus', noviStatus);
    return this.http.patch<UslugaProizvod>(`${this.baseUrl}/${id}/status`, {}, { params, withCredentials: true });
  }

  uredi(id: number, usluga: Partial<UslugaProizvod>): Observable<UslugaProizvod> {
    return this.http.patch<UslugaProizvod>(`${this.baseUrl}/${id}/status`, usluga, { withCredentials: true });
  }

  obrisi(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${id}`, { withCredentials: true, responseType: 'text' as any });
  }
}
