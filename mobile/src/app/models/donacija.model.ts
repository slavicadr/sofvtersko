export interface DonacijaRequest {
  donatorId?: number | null;
  pomocId: number;
  iznos: number;
  nacinPlacanja?: string;
  anonimno: boolean;
}

export interface Donacija {
  donacijaId: number;
  iznos: number;
  statusDonacije?: string;
  statusPlacanja?: string;
  nacinPlacanja?: string;
  datumDonacije?: string;
  anonimno: boolean;
}
