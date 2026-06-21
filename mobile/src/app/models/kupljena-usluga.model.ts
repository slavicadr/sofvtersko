export interface KupljenaUsluga {
  kupovinaId: number;
  uslugaProizvod?: {
    uslugaProizvodId: number;
    naziv: string;
    cijena?: number;
    kategorija?: { naziv: string };
  };
  kupac?: { korisnikId: number; ime: string; prezime: string };
  korisnikPomoci?: { korisnikPomociId: number; ime?: string; prezime?: string };
  datumKupovine?: string;
  statusIsporuke?: string;
  iznos?: number;
  datumRealizacije?: string;
}
