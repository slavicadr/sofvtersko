import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { KupljenaUsluga } from '../models/kupljena-usluga.model';

@Injectable({ providedIn: 'root' })
export class KupljenaUslugaService {
  private readonly baseUrl = `${environment.apiUrl}/api/kupovine`;

  constructor(private http: HttpClient) {}

  getByKupac(kupacId: number): Observable<KupljenaUsluga[]> {
    return this.http.get<KupljenaUsluga[]>(`${this.baseUrl}/kupac/${kupacId}`, { withCredentials: true });
  }

  getByVolonter(volonterId: number): Observable<KupljenaUsluga[]> {
    return this.http.get<KupljenaUsluga[]>(`${this.baseUrl}/volonter/${volonterId}`, { withCredentials: true });
  }

  oznaciRealizovano(id: number): Observable<KupljenaUsluga> {
    return this.http.patch<KupljenaUsluga>(`${this.baseUrl}/${id}/realizovano`, {}, { withCredentials: true });
  }

  kupi(kupacId: number, uslugaId: number, pomocId: number, iznos: number | null, nacinPlacanja = 'KARTICA'): Observable<KupljenaUsluga> {
    return this.http.post<KupljenaUsluga>(`${this.baseUrl}/kupi`,
      { kupacId, uslugaId, pomocId, iznos, nacinPlacanja },
      { withCredentials: true }
    );
  }
}
