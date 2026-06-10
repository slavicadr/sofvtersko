import { Korisnik } from './korisnik.model';

export interface Profil {
  profilId: number;
  korisnik: Korisnik;
  opis?: string;
  profilnaSlika?: string;
  grad?: string;
  portfolioLink?: string;
  prosjecnaOcjena?: number;
}
