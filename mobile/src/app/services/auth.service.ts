import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Korisnik } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/korisnici`;
  private _currentUser = new BehaviorSubject<Korisnik | null>(null);

  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): Korisnik | null {
    return this._currentUser.value;
  }

  isLoggedIn(): boolean {
    return this._currentUser.value !== null;
  }

  login(email: string, lozinka: string): Observable<Korisnik> {
    return this.http
      .post<Korisnik>(`${this.baseUrl}/login`, { email, lozinka }, { withCredentials: true })
      .pipe(tap(user => this._currentUser.next(user)));
  }

  logout(): Observable<string> {
    const korisnikId = this._currentUser.value?.korisnikId;
    return this.http
      .post(`${this.baseUrl}/logout`, { korisnikId }, { withCredentials: true, responseType: 'text' })
      .pipe(tap(() => this._currentUser.next(null)));
  }

  register(korisnik: Partial<Korisnik> & { lozinkaHash: string }): Observable<Korisnik> {
    return this.http
      .post<Korisnik>(`${this.baseUrl}/registracija`, korisnik, { withCredentials: true })
      .pipe(tap(user => this._currentUser.next(user)));
  }

  registerKupac(korisnik: Partial<Korisnik> & { lozinkaHash: string }): Observable<Korisnik> {
    return this.http
      .post<Korisnik>(`${this.baseUrl}/registracija/kupac`, korisnik, { withCredentials: true })
      .pipe(tap(user => this._currentUser.next(user)));
  }
}
