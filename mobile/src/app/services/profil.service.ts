import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profil } from '../models/profil.model';
import { Korisnik } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private readonly baseUrl = `${environment.apiUrl}/api/profili`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Profil[]> {
    return this.http.get<Profil[]>(this.baseUrl, { withCredentials: true });
  }

  getByKorisnik(korisnik: Korisnik): Observable<Profil> {
    return this.http.post<Profil>(`${this.baseUrl}/pretraga-korisnik`, korisnik, { withCredentials: true });
  }

  getNajbolji(ocjena: number): Observable<Profil[]> {
    const params = new HttpParams().set('ocena', ocjena.toString());
    return this.http.get<Profil[]>(`${this.baseUrl}/najbolji`, { params, withCredentials: true });
  }
}
