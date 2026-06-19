import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
