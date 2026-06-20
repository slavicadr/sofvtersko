import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KorisnikPomoci } from '../models/models';

@Injectable({ providedIn: 'root' })
export class KorisnikPomociService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<KorisnikPomoci[]> {
    return this.http.get<KorisnikPomoci[]>('/api/korisnici-pomoci');
  }

  getAllAdmin(): Observable<KorisnikPomoci[]> {
    return this.http.get<KorisnikPomoci[]>('/api/korisnici-pomoci/admin/svi');
  }

  getById(id: number): Observable<KorisnikPomoci> {
    return this.http.get<KorisnikPomoci>(`/api/korisnici-pomoci/${id}`);
  }

  create(data: any): Observable<KorisnikPomoci> {
    return this.http.post<KorisnikPomoci>('/api/korisnici-pomoci', data);
  }

  mapToView(p: KorisnikPomoci): any {
    const words = (p.naziv ?? '').split(' ');
    const initials = words.map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2);
    return {
      id: p.pomocId,
      name: p.naziv,
      category: 'Opšta pomoć',
      description: p.opisPotrebe,
      fullDescription: p.opisPotrebe,
      goal: 5000,
      raised: 0,
      imageUrl: '',
      initials,
      volunteers: [],
      history: [],
    };
  }
}
