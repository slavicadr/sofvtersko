import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { KorisnikPomoci } from '../models/korisnik-pomoci.model';

@Injectable({ providedIn: 'root' })
export class KorisnikPomociService {
  private readonly baseUrl = `${environment.apiUrl}/api/korisnici-pomoci`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<KorisnikPomoci[]> {
    return this.http.get<KorisnikPomoci[]>(this.baseUrl, { withCredentials: true });
  }

  getById(id: number): Observable<KorisnikPomoci> {
    return this.http.get<KorisnikPomoci>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  pretrazi(naziv: string): Observable<KorisnikPomoci[]> {
    const params = new HttpParams().set('naziv', naziv);
    return this.http.get<KorisnikPomoci[]>(`${this.baseUrl}/pretraga`, { params, withCredentials: true });
  }
}
