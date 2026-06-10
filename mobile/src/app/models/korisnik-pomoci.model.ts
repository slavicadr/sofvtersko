import { Korisnik } from './korisnik.model';

export interface KorisnikPomoci {
  pomocId: number;
  korisnik: Korisnik;
  naziv: string;
  opisPotrebe?: string;
  brojRacuna: string;
  dokazVerifikacije?: string;
}
