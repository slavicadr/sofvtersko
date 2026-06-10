import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KupljenaUsluga } from '../models/models';

@Injectable({ providedIn: 'root' })
export class KupovinaService {
  constructor(private http: HttpClient) {}

  kupi(data: { kupacId: number; uslugaId: number; pomocId: number; nacinPlacanja: string }): Observable<KupljenaUsluga> {
    return this.http.post<KupljenaUsluga>('/api/kupovine/kupi', data);
  }

  getByKupac(kupacId: number): Observable<KupljenaUsluga[]> {
    return this.http.get<KupljenaUsluga[]>(`/api/kupovine/kupac/${kupacId}`);
  }

  getAll(): Observable<KupljenaUsluga[]> {
    return this.http.get<KupljenaUsluga[]>('/api/kupovine');
  }

  getByVolonter(volonterId: number): Observable<KupljenaUsluga[]> {
    return this.http.get<KupljenaUsluga[]>(`/api/kupovine/volonter/${volonterId}`);
  }

  oznaciRealizovano(kupovinaId: number): Observable<KupljenaUsluga> {
    return this.http.patch<KupljenaUsluga>(`/api/kupovine/${kupovinaId}/realizovano`, {});
  }
}
