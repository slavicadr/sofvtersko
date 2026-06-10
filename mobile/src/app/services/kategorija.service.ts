import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Kategorija } from '../models/kategorija.model';

@Injectable({ providedIn: 'root' })
export class KategorijaService {
  private readonly baseUrl = `${environment.apiUrl}/api/kategorije`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Kategorija[]> {
    return this.http.get<Kategorija[]>(this.baseUrl, { withCredentials: true });
  }
}
