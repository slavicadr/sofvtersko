import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Korisnik } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/api/korisnici`;

  constructor(private http: HttpClient) {}

  getNaCekanju(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(`${this.baseUrl}/status/na_cekanju`, { withCredentials: true });
  }

  odobriKorisnika(id: number): Observable<Korisnik> {
    return this.http.put<Korisnik>(`${this.baseUrl}/${id}/status`,
      { noviStatus: 'aktivan', razlog: 'Odobreno od administratora' },
      { withCredentials: true }
    );
  }

  odbijKorisnika(id: number, razlog: string): Observable<Korisnik> {
    return this.http.put<Korisnik>(`${this.baseUrl}/${id}/status`,
      { noviStatus: 'suspendovan', razlog },
      { withCredentials: true }
    );
  }
}
