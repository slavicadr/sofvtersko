export type TipKorisnika = 'donator' | 'volonter' | 'kupac' | 'korisnik_pomoci' | 'administrator';
export type StatusNaloga = 'aktivan' | 'na_cekanju' | 'neaktivan' | 'suspendovan' | 'uklonjen';

export interface Korisnik {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  adresa?: string;
  naziv?: string;
  opis?: string;
  prikazAnonimno: boolean;
  tipKorisnika: TipKorisnika;
  statusNaloga: StatusNaloga;
  datumRegistracije?: string;
  verifikovan: boolean;
}
