import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Korisnik, Verifikacija, LogAktivnosti } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllKorisnici(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>('/api/korisnici');
  }

  promijeniStatus(id: number, noviStatus: string, razlog: string): Observable<Korisnik> {
    return this.http.put<Korisnik>(`/api/korisnici/${id}/status`, { noviStatus, razlog });
  }

  getAllVerifikacije(): Observable<Verifikacija[]> {
    return this.http.get<Verifikacija[]>('/api/verifikacije');
  }

  obradiVerifikaciju(id: number, status: string, napomena: string): Observable<Verifikacija> {
    return this.http.put<Verifikacija>(`/api/verifikacije/${id}/obradi`, null, {
      params: { status, napomena }
    });
  }

  getVolonterInfo(id: number): Observable<any> {
    return this.http.get<any>(`/api/volonter-info/${id}/dashboard`);
  }

  getLogs(): Observable<LogAktivnosti[]> {
    return this.http.get<LogAktivnosti[]>('/api/logovi');
  }

  getStatistike(): Observable<any> {
    return this.http.get<any>('/api/logovi/statistike');
  }
}
