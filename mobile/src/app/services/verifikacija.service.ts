import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Verifikacija {
  verifikacijaId: number;
  korisnik?: { korisnikId: number; ime: string; prezime: string; email: string; tipKorisnika: string };
  uslugaProizvod?: { uslugaProizvodId: number; naziv: string; cijena?: number };
  tipVerifikacije?: string;
  status?: string;
  napomena?: string;
  datumVerifikacije?: string;
}

@Injectable({ providedIn: 'root' })
export class VerifikacijaService {
  private readonly baseUrl = `${environment.apiUrl}/api/verifikacije`;

  constructor(private http: HttpClient) {}

  getNaCekanju(): Observable<Verifikacija[]> {
    return this.http.get<Verifikacija[]>(`${this.baseUrl}/status`, {
      params: new HttpParams().set('status', 'na_cekanju'),
      withCredentials: true
    });
  }

  obradi(id: number, status: 'odobreno' | 'odbijeno', napomena = ''): Observable<Verifikacija> {
    let params = new HttpParams().set('status', status);
    if (napomena) params = params.set('napomena', napomena);
    return this.http.put<Verifikacija>(`${this.baseUrl}/${id}/obradi`, {}, { params, withCredentials: true });
  }
}
