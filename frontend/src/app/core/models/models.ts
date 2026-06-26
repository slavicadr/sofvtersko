export interface Korisnik {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  adresa?: string;
  opis?: string;
  tipKorisnika: 'kupac' | 'volonter' | 'administrator' | 'donator' | 'korisnik_pomoci';
  statusNaloga: 'aktivan' | 'na_cekanju' | 'suspendovan' | 'uklonjen';
  verifikovan: boolean;
  prikazAnonimno: boolean;
  datumRegistracije?: string;
}

export interface Kategorija {
  kategorijaId: number;
  naziv: string;
  opis?: string;
}

export interface UslugaProizvod {
  uslugaProizvodId: number;
  volonter: Korisnik;
  kategorija: Kategorija;
  naziv: string;
  opis: string;
  tip: 'usluga' | 'proizvod';
  cijena: number;
  statusObjave: string;
  kapacitet?: number;
}

export interface KorisnikPomoci {
  pomocId: number;
  korisnik: Korisnik;
  naziv: string;
  opisPotrebe: string;
  brojRacuna: string;
}

export interface Donacija {
  donacijaId: number;
  donator?: Korisnik | null;
  korisnikPomoci: KorisnikPomoci;
  iznos: number;
  nacinPlacanja: string;
  statusDonacije: string;
  statusPlacanja: string;
  datumDonacije?: string;
  anonimno: boolean;
}

export interface KupljenaUsluga {
  kupovinaId: number;
  donator: Korisnik;
  uslugaProizvod: UslugaProizvod;
  korisnikPomoci: KorisnikPomoci;
  iznos: number;
  datumKupovine: string;
  statusPlacanja: string;
  nacinPlacanja: string;
  statusIsporuke: string;
  datumRealizacije?: string;
}

export interface OcjenaRecenzija {
  ocjenaId: number;
  kupovina: KupljenaUsluga;
  kupac: Korisnik;
  brojZvjezdica: number;
  komentar: string;
  datumOcjene?: string;
}

export interface Verifikacija {
  verifikacijaId: number;
  korisnik: Korisnik;
  administrator?: Korisnik;
  tipVerifikacije: string;
  status: string;
  napomena?: string;
  datumVerifikacije: string;
}

export interface ChatPoruka {
  porukaId: number;
  kupovina: KupljenaUsluga;
  posiljalac: Korisnik;
  sadrzaj: string;
  vrijemeSlanda: string;
}

export interface LogAktivnosti {
  logId: number;
  korisnik?: Korisnik;
  tipAktivnosti: string;
  ipAdresa: string;
  detalji?: string;
  vrijemeAktivnosti: string;
}
