import { Korisnik } from './korisnik.model';
import { UslugaProizvod } from './usluga-proizvod.model';

export interface KupljenaUslugaMini {
  kupovinaId: number;
  uslugaProizvod?: UslugaProizvod;
  datumKupovine?: string;
}

export interface OcjenaRecenzija {
  ocjenaId: number;
  kupovina?: KupljenaUslugaMini;
  ocjenjivac?: Korisnik;
  brojZvjezdica: number;
  komentar?: string;
  datumOcjene?: string;
}
