import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Donacija, DonacijaRequest } from '../models/donacija.model';

@Injectable({ providedIn: 'root' })
export class DonacijaService {
  private readonly baseUrl = `${environment.apiUrl}/api/donacije`;

  constructor(private http: HttpClient) {}

  doniraj(request: DonacijaRequest): Observable<Donacija> {
    return this.http.post<Donacija>(this.baseUrl, request, { withCredentials: true });
  }

  getAll(): Observable<Donacija[]> {
    return this.http.get<Donacija[]>(this.baseUrl, { withCredentials: true });
  }
}
