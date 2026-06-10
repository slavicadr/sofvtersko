import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Korisnik } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<Korisnik | null>(
    this.loadFromStorage()
  );
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): Korisnik | null { return this.userSubject.value; }
  get isLoggedIn(): boolean { return !!this.userSubject.value; }
  get role(): string { return this.userSubject.value?.tipKorisnika ?? ''; }

  login(email: string, lozinka: string): Observable<Korisnik> {
    return this.http.post<Korisnik>('/api/korisnici/login', { email, lozinka }).pipe(
      tap(user => this.setUser(user))
    );
  }

  registerKupac(data: any): Observable<Korisnik> {
    return this.http.post<Korisnik>('/api/korisnici/registracija/kupac', data).pipe(
      tap(user => this.setUser(user))
    );
  }

  registerVolonter(data: any): Observable<Korisnik> {
    return this.http.post<Korisnik>('/api/korisnici/registracija', data);
  }

  checkEmail(email: string): Observable<{ postoji: boolean }> {
    return this.http.get<{ postoji: boolean }>(`/api/korisnici/provjeri-email?email=${encodeURIComponent(email)}`);
  }

  logout(): Observable<any> {
    const id = this.currentUser?.korisnikId;
    this.clearUser();
    return this.http.post('/api/korisnici/logout', { korisnikId: id }, { responseType: 'text' });
  }

  getDashboardRoute(): string {
    const map: any = {
      kupac: '/kupac/dashboard',
      volonter: '/volonter/dashboard',
      administrator: '/admin/dashboard',
    };
    return map[this.role] ?? '/';
  }

  private setUser(user: Korisnik) {
    this.userSubject.next(user);
    sessionStorage.setItem('dobrobit_user', JSON.stringify(user));
  }

  clearUser() {
    this.userSubject.next(null);
    sessionStorage.removeItem('dobrobit_user');
  }

  private loadFromStorage(): Korisnik | null {
    try {
      const raw = sessionStorage.getItem('dobrobit_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
