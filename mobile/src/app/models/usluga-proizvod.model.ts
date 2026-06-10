import { Korisnik } from './korisnik.model';
import { Kategorija } from './kategorija.model';

export interface UslugaProizvod {
  uslugaProizvodId: number;
  volonter: Korisnik;
  kategorija: Kategorija;
  naziv: string;
  opis?: string;
  tip?: string;
  cijena?: number;
  statusObjave?: string;
  datumKreiranja?: string;
  kapacitet?: number;
}
