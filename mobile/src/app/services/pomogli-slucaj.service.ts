import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PomogliSlucaj {
  id: number;
  naslov: string;
  tekst: string;
  boja: string;
  redoslijed: number;
}

export interface Katalog {
  id: number;
  naslov: string;
  opis: string;
  pdfUrl: string;
  redoslijed: number;
}

@Injectable({ providedIn: 'root' })
export class PomogliSlucajService {
  constructor(private http: HttpClient) {}

  getSlucajevi(): Observable<PomogliSlucaj[]> {
    return this.http.get<PomogliSlucaj[]>(`${environment.apiUrl}/api/pomogli-slucajevi`);
  }

  getKataloge(): Observable<Katalog[]> {
    return this.http.get<Katalog[]>(`${environment.apiUrl}/api/katalozi`);
  }
}
