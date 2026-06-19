# Dobrobit – Mobilna aplikacija: Tehnička dokumentacija

## Sadržaj

1. [Pregled projekta](#1-pregled-projekta)
2. [Tehnološki stack](#2-tehnološki-stack)
3. [Struktura foldera](#3-struktura-foldera)
4. [Backend – šta se koristi](#4-backend--šta-se-koristi)
5. [Dizajn sistem i teme](#5-dizajn-sistem-i-teme)
6. [Routing i navigacija](#6-routing-i-navigacija)
7. [Autentifikacija](#7-autentifikacija)
8. [Servisi (Angular)](#8-servisi-angular)
9. [Modeli podataka (TypeScript)](#9-modeli-podataka-typescript)
10. [Stranice – detalji implementacije](#10-stranice--detalji-implementacije)
11. [Šta je preuzeto s frontenda](#11-šta-je-preuzeto-s-frontenda)
12. [Šta je novo / dodano](#12-šta-je-novo--dodano)
13. [Komunikacija s backendom](#13-komunikacija-s-backendom)
14. [Poznata ograničenja](#14-poznata-ograničenja)

---

## 1. Pregled projekta

Mobilna aplikacija **Dobrobit** je Ionic Angular aplikacija smještena u folderu `mobile/` unutar monorepa `backend8jun/`. Ona je vizualni i funkcionalni ekvivalent web frontenda (Angular 17, folder `frontend/`), prilagođen za mobilne uređaje korišćenjem Ionic framework-a.

Aplikacija komunicira s **istim Spring Boot backendom** (`sofvtersko/`) kao i web frontend — nema posebnog mobilnog API-ja. Backend radi na `http://localhost:8080`, mobilna aplikacija na `http://localhost:4300`.

### Šta aplikacija nudi

| Tab | Naziv | Funkcija |
|-----|-------|----------|
| Tab 1 | Početna | Hero, statistike, koraci, humanitarni slučajevi, uloge, recenzije, partneri, footer |
| Tab 2 | Usluge | Pretraga i filtriranje usluga po kategoriji, detalji usluge, profil volontera s recenzijama |
| Tab 3 | Profil | Prikaz podataka prijavljenog korisnika, odjava |

---

## 2. Tehnološki stack

| Tehnologija | Verzija | Uloga |
|-------------|---------|-------|
| **Ionic Framework** | 8.x | UI komponente prilagođene mobilnim uređajima |
| **Angular** | 20.x | SPA framework, dependency injection, reactive forms |
| **TypeScript** | 5.x | Tipizacija cijelog frontend koda |
| **RxJS** | 7.x | Reaktivno programiranje — HTTP pozivi, `BehaviorSubject`, `forkJoin` |
| **SCSS** | — | Stilizacija, Ionic CSS varijable, design tokeni |
| **Spring Boot** | 3.4.5 | Backend REST API, session-based autentifikacija |
| **MySQL** | 8.0.45 | Baza podataka |
| **Google Fonts** | — | `Playfair Display` (naslovi), `DM Sans` (tijelo teksta) |

---

## 3. Struktura foldera

```
mobile/
├── src/
│   ├── app/
│   │   ├── app-routing.module.ts      # Globalni routing s AuthGuardom
│   │   ├── app.module.ts              # Korijeni Angular modul
│   │   ├── app.component.ts/html      # Root komponenta
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Zaštita ruta — preusmjerava na login
│   │   │
│   │   ├── models/                    # TypeScript interfejsi (mirror backend entiteta)
│   │   │   ├── korisnik.model.ts
│   │   │   ├── korisnik-pomoci.model.ts
│   │   │   ├── usluga-proizvod.model.ts
│   │   │   ├── kategorija.model.ts
│   │   │   ├── donacija.model.ts
│   │   │   ├── profil.model.ts
│   │   │   └── ocjena-recenzija.model.ts   ← NOVO
│   │   │
│   │   ├── services/                  # Angular servisi za HTTP komunikaciju
│   │   │   ├── auth.service.ts
│   │   │   ├── usluga-proizvod.service.ts
│   │   │   ├── kategorija.service.ts
│   │   │   ├── korisnik-pomoci.service.ts
│   │   │   ├── donacija.service.ts
│   │   │   ├── profil.service.ts
│   │   │   └── ocjena-recenzija.service.ts ← NOVO
│   │   │
│   │   ├── pages/
│   │   │   ├── login/                 # Stranica za prijavu
│   │   │   ├── register/              # Stranica za registraciju
│   │   │   └── case-detail/           # Detalji humanitarnog slučaja
│   │   │
│   │   ├── tabs/
│   │   │   └── tabs.page.html         # Tab bar (Početna / Usluge / Profil)
│   │   │
│   │   ├── tab1/                      # Početna strana
│   │   ├── tab2/                      # Usluge volontera
│   │   └── tab3/                      # Profil korisnika
│   │
│   ├── environments/
│   │   └── environment.ts             # apiUrl: 'http://localhost:8080'
│   │
│   ├── global.scss                    # Globalni stilovi, Ionic override-i
│   └── theme/
│       └── variables.scss             # Design tokeni i Ionic CSS varijable
│
└── package.json                       # Ionic/Angular zavisnosti
```

---

## 4. Backend – šta se koristi

Mobilna aplikacija koristi **isti backend** kao web frontend, bez ikakvih izmjena u logici. Jedina izmjena u backendu bila je dodavanje porta `4300` u CORS konfiguraciju.

### 4.1 CORS konfiguracija (izmjena)

**Fajl:** `sofvtersko/src/main/java/com/fakultet/dobrobit/config/SecurityConfig.java`

```java
config.setAllowedOrigins(List.of(
    "http://localhost:4200",   // Web frontend
    "http://localhost:4300",   // ← DODANO: Mobilna aplikacija
    "http://localhost:8100"    // Ionic dev server (alternativni port)
));
```

Bez ovog, pretraživač bi blokirao sve HTTP zahtjeve mobilne aplikacije prema backendu zbog Same-Origin Policy.

### 4.2 Korišćeni backend endpointi

| Endpoint | Metoda | Ko poziva | Svrha |
|----------|--------|-----------|-------|
| `/api/korisnici/login` | POST | `AuthService` | Prijava korisnika |
| `/api/korisnici/logout` | POST | `AuthService` | Odjava korisnika |
| `/api/korisnici/registracija` | POST | `AuthService` | Registracija volontera/donatora |
| `/api/korisnici/registracija/kupac` | POST | `AuthService` | Registracija kupca |
| `/api/usluge-proizvodi` | GET | `UslugaProizvodService` | Sve usluge volontera |
| `/api/usluge-proizvodi/filter-volonter` | POST | `UslugaProizvodService` | Usluge određenog volontera |
| `/api/kategorije` | GET | `KategorijaService` | Sve kategorije |
| `/api/korisnici-pomoci` | GET | `KorisnikPomociService` | Humanitarni slučajevi |
| `/api/korisnici-pomoci/{id}` | GET | `KorisnikPomociService` | Jedan slučaj |
| `/api/donacije` | GET | `DonacijaService` | Sve donacije (za izračun prikupljenog iznosa) |
| `/api/recenzije/volonter/{id}` | GET | `OcjenaRecenzijaService` | Recenzije za volontera |
| `/api/recenzije/volonter/{id}/prosjek` | GET | `OcjenaRecenzijaService` | Prosječna ocjena volontera |
| `/api/profili` | GET | `ProfilService` | Svi profili |

### 4.3 Session-based autentifikacija

Backend koristi **Spring Security session cookies** — nema JWT tokena. Svaki HTTP zahtjev šalje `{ withCredentials: true }` što uključuje session cookie u request, a pretraživač ga automatski čuva i šalje. Ovo je ključno za sve zaštićene endpointe.

---

## 5. Dizajn sistem i teme

### 5.1 Zašto ne može direktan kod-sharing s frontendom

Ionic Angular i čisti Angular koriste drugačije HTML elemente:

| Web frontend | Ionic mobile |
|-------------|--------------|
| `<div>`, `<button>`, `<input>` | `<ion-card>`, `<ion-button>`, `<ion-input>` |
| `<nav>`, `<ul>` | `<ion-tab-bar>`, `<ion-list>` |
| `<form>` | `<form>` + `ion-item` + `ion-input` |

Zbog toga HTML template-i **ne mogu biti direktno preuzeti**. Ono što se dijeli su:

- **CSS design tokeni** (boje, font-size, border-radius)
- **Angular servisi** (HTTP pozivi prema istom backendu)
- **TypeScript modeli** (isti interfejsi)

### 5.2 Design tokeni – `src/theme/variables.scss`

Ovaj fajl je **potpuno prepisan** da odražava Dobrobit vizuelni identitet.

#### Prilagođene CSS varijable (Dobrobit tokeni)

```scss
:root {
  --db-teal:        #2d6b55;   // Primarna teal boja — header, dugmad, ikonice
  --db-teal-mid:    #3d8c6e;   // Nešto svjetliji teal — gradienti avatara
  --db-lime:        #7ab648;   // Sekundarna lime/zelena
  --db-peach-skin:  #d4a882;   // Narandžasta akcentna boja

  --db-text:        #111111;   // Primarni tekst
  --db-text-mid:    #444444;   // Sekundarni tekst (opisi, meta)
  --db-text-light:  #888888;   // Tercijalni tekst (labele, datumi)

  --db-mint-from:   #a8ddd0;   // Mint gradijent — početak
  --db-mint-to:     #c8ede4;   // Mint gradijent — kraj (pozadina stranica)
  --db-lime-from:   #b8e080;   // Lime gradijent
  --db-lime-to:     #d4f09a;
  --db-peach-from:  #f0c89e;
  --db-peach-to:    #fce0c0;

  --db-radius-sm:   10px;
  --db-radius-md:   16px;
  --db-radius-lg:   24px;
  --db-radius-pill: 50px;      // Za pill dugmad i badge-ove
}
```

#### Prepisani Ionic CSS tokeni

Ionic čita sistemske varijable poput `--ion-color-primary` za sve komponente. Prepisivanjem ovih varijabli postižemo da svaki `ion-button`, `ion-spinner`, `ion-tab-bar` automatski koristi Dobrobit boje, bez ručnog stiliziranja svake komponente.

```scss
--ion-color-primary:         #2d6b55;  // Sva dugmad, aktivna stanja
--ion-background-color:      #c8ede4;  // Pozadina svih stranica (mint)
--ion-toolbar-background:    #2d6b55;  // Header toolbar — teal
--ion-toolbar-color:         #ffffff;  // Tekst u headeru — bijeli
--ion-tab-bar-background:    rgba(255,255,255,0.96);  // Tab bar — bijeli
--ion-tab-bar-color-selected:#2d6b55;  // Aktivna tab ikonica — teal
--ion-card-background:       rgba(255,255,255,0.82);  // Glassmorphism kartice
```

### 5.3 Globalni stilovi – `src/global.scss`

Ovaj fajl se učitava prvi i važi za cijelu aplikaciju. Importuje Ionic CSS, temu i Google Fonts, te definira globalne override-e za Ionic komponente:

| Selektor | Šta se mijenja |
|----------|---------------|
| `ion-title`, `h1`–`h4` | Font: `Playfair Display`, serif, bold |
| `ion-content`, `p`, `span`, `div` | Font: `DM Sans`, sans-serif |
| `ion-toolbar` | Teal pozadina, bijeli tekst, searchbar bez granice |
| `ion-content` | Mint pozadina (`#c8ede4`) |
| `ion-card` | Glassmorphism: bijelo 82% opacity, `backdrop-filter: blur(8px)`, border-radius 16px |
| `ion-button` | Pill oblik (`border-radius: 50px`), bez `text-transform` |
| `ion-chip` | Mint pozadina, teal tekst, border |
| `ion-tab-bar` | Bijela, visina 60px, sjenka prema gore, `safe-area-inset` padding |
| `.empty-state` | Centriran prikaz kad nema podataka |
| `.loader` | Centriran spinner |
| `.db-progress-bar` | Progress bar za donacije (mirror frontenda) |
| `.section-tag-mobile` | Pill tag iznad naslova sekcija (uppercase, teal) |

---

## 6. Routing i navigacija

**Fajl:** `src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  { path: 'login',    loadChildren: () => import('./pages/login/login.module')... },
  { path: 'register', loadChildren: () => import('./pages/register/register.module')... },
  {
    path: '',
    canActivate: [AuthGuard],          // ← Zaštita svih tabova
    loadChildren: () => import('./tabs/tabs.module')...
  },
  { path: '**', redirectTo: 'login' } // Svaka nepostojεća ruta → login
];
```

### Lazy loading

Svaki modul (`login`, `register`, `tabs`) učitava se tek kada korisnik naviguje na tu rutu — `loadChildren` sa dinamičkim `import()`. Ovo smanjuje inicijalni bundle.

### Tab routing

```
/tabs/tab1  → Početna
/tabs/tab2  → Usluge
/tabs/tab3  → Profil
/tabs/tab1/detalj/:id → Detalji humanitarnog slučaja (case-detail)
```

### Tab bar – `src/app/tabs/tabs.page.html`

```html
<ion-tab-button tab="tab1" href="/tabs/tab1">
  <ion-icon name="home-outline"></ion-icon>
  <ion-label>Početna</ion-label>          <!-- Promijenjeno: bilo "Slučajevi" -->
</ion-tab-button>

<ion-tab-button tab="tab2" href="/tabs/tab2">
  <ion-icon name="construct-outline"></ion-icon>
  <ion-label>Usluge</ion-label>
</ion-tab-button>

<ion-tab-button tab="tab3" href="/tabs/tab3">
  <ion-icon name="person-outline"></ion-icon>
  <ion-label>Profil</ion-label>
</ion-tab-button>
```

---

## 7. Autentifikacija

### 7.1 AuthGuard – `src/app/guards/auth.guard.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
```

Guard provjerava da li `AuthService._currentUser` BehaviorSubject ima vrijednost. Ako ne, preusmjerava na `/login`. Važi za sve tabove istovremeno jer je guard postavljen na roditeljsku rutu `''`.

**Ograničenje:** Stanje je in-memory — osvježavanje stranice resetuje `_currentUser` na `null` i uvijek vraća na login, čak i ako session cookie još važi na backendu.

### 7.2 AuthService – `src/app/services/auth.service.ts`

```typescript
private _currentUser = new BehaviorSubject<Korisnik | null>(null);
currentUser$ = this._currentUser.asObservable(); // Observable za reaktivne komponente
```

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `login(email, lozinka)` | `POST /api/korisnici/login` | Šalje kredencijale, na uspjeh stavlja korisnika u BehaviorSubject |
| `logout()` | `POST /api/korisnici/logout` | Poziva backend logout, čisti BehaviorSubject |
| `register(korisnik)` | `POST /api/korisnici/registracija` | Za volontere |
| `registerKupac(korisnik)` | `POST /api/korisnici/registracija/kupac` | Za kupce (poseban endpoint) |
| `isLoggedIn()` | — | Vraća `true` ako `_currentUser.value !== null` |

Svaki poziv koristi `.pipe(tap(...))` da ažurira BehaviorSubject na osnovu API odgovora, bez posebnog upravljanja stanjem.

### 7.3 Login stranica – `src/app/pages/login/`

Koristi **Angular Reactive Forms** (`FormBuilder`, `FormGroup`, `Validators`):

```typescript
form = fb.group({
  email:   ['', [Validators.required, Validators.email]],
  lozinka: ['', Validators.required]
});
```

HTML koristi `[formGroup]`, `formControlName` i `*ngIf` za prikaz validacijskih grešaka. Na uspješnu prijavu naviguje na `/tabs/tab1`.

**Vizuelne izmjene:** Dodata teal krug-logo s ikonom srca iznad naslova, mint pozadina, pill login dugme.

### 7.4 Register stranica – `src/app/pages/register/`

**Izmjena:** Uklonjen tip korisnika `donator` iz niza dostupnih tipova. Donatori nemaju profil u sistemu pa se ne mogu registrovati kroz mobilnu aplikaciju.

```typescript
tipovi = [
  { label: 'Kupac',    value: 'kupac' },
  { label: 'Volonter', value: 'volonter' },
  // Donator uklonjen
];
```

Forma ima polja: `ime`, `prezime`, `email`, `lozinkaHash` (min 6 znakova), `telefon`, `adresa`, `tipKorisnika`. Na uspješnu registraciju prikazuje `AlertController` poruku i vraća na login.

---

## 8. Servisi (Angular)

Svi servisi su `providedIn: 'root'` — singleton instance dostupne u cijeloj aplikaciji. Svaki konstrukt prima `HttpClient` putem dependency injection.

### 8.1 AuthService *(postojao, proširen)*

Opisano u sekciji 7.2.

### 8.2 KorisnikPomociService *(postojao, nepromijenjen)*

**Fajl:** `src/app/services/korisnik-pomoci.service.ts`

Poziva `/api/korisnici-pomoci` za humanitarne slučajeve prikazane na početnoj strani.

```typescript
getAll()      // GET /api/korisnici-pomoci — sve žrtve/slučajevi
getById(id)   // GET /api/korisnici-pomoci/{id}
pretrazi(naziv) // GET /api/korisnici-pomoci/pretraga?naziv=...
```

Koristi se u `Tab1Page.ucitajSlucajeve()` — dohvaća sve slučajeve, sortira po `pomocId` DESC, uzima prvih 3 za prikaz na naslovnoj strani.

### 8.3 DonacijaService *(postojao, model proširen)*

**Fajl:** `src/app/services/donacija.service.ts`

```typescript
getAll() // GET /api/donacije
```

Koristi se na Tab1 za izračun prikupljenog iznosa po slučaju. Filtrira donacije po `korisnikPomoci.pomocId` i sumira `iznos`.

**Izmjena modela:** `src/app/models/donacija.model.ts` — dodano opcionalno polje `korisnikPomoci?: { pomocId: number }` jer backend vraća ovaj odnos u JSON odgovoru, a TypeScript je javljao grešku pri kompajliranju.

### 8.4 KategorijaService *(postojao, nepromijenjen)*

```typescript
getAll() // GET /api/kategorije
```

Koristi se u `Tab2Page` za učitavanje kategorija i prikaz pill segmenta za filtriranje.

### 8.5 UslugaProizvodService *(postojao, proširen metodom)*

**Fajl:** `src/app/services/usluga-proizvod.service.ts`

```typescript
getAll()                  // GET /api/usluge-proizvodi
getById(id)               // GET /api/usluge-proizvodi/{id}
getByVolonter(volonter)   // ← NOVO: POST /api/usluge-proizvodi/filter-volonter
```

`getByVolonter` šalje cijeli `Korisnik` objekat u tijelu POST zahtjeva jer backend endpoint `@RequestBody Korisnik volonter` tako očekuje. Rezultat se koristi u profilu volontera za prikaz njegovih ostalih usluga.

### 8.6 ProfilService *(postojao, nekorišćen direktno na tab2)*

```typescript
getAll()              // GET /api/profili
getByKorisnik(k)      // POST /api/profili/pretraga-korisnik
getNajbolji(ocjena)   // GET /api/profili/najbolji?ocena=...
```

Servis postoji i koristi se potencijalno na Tab3 (profil korisnika).

### 8.7 OcjenaRecenzijaService *(NOVO)*

**Fajl:** `src/app/services/ocjena-recenzija.service.ts`

```typescript
getByVolonter(volonterId: number)   // GET /api/recenzije/volonter/{id}
getProsjecnaOcjena(volonterId)       // GET /api/recenzije/volonter/{id}/prosjek
```

Ovaj servis je kreiran posebno za prikaz profila volontera na mobilnoj aplikaciji. Poziva dva backend endpointa koji su već bili implementirani u `OcjenaRecenzijaController.java`, ali mobilna aplikacija ih do sad nije koristila.

---

## 9. Modeli podataka (TypeScript)

TypeScript interfejsi preslikavaju Java entitete iz backenda.

### Korisnik – `models/korisnik.model.ts`

```typescript
export interface Korisnik {
  korisnikId:          number;
  ime:                 string;
  prezime:             string;
  email:               string;
  telefon?:            string;
  adresa?:             string;
  naziv?:              string;         // Za organizacije
  opis?:               string;
  prikazAnonimno:      boolean;
  tipKorisnika:        TipKorisnika;   // 'donator' | 'volonter' | 'kupac' | ...
  statusNaloga:        StatusNaloga;
  datumRegistracije?:  string;
  verifikovan:         boolean;
}
```

### UslugaProizvod – `models/usluga-proizvod.model.ts`

```typescript
export interface UslugaProizvod {
  uslugaProizvodId: number;
  volonter:         Korisnik;     // Ugniježđen cijeli Korisnik objekat
  kategorija:       Kategorija;   // Ugniježđena Kategorija
  naziv:            string;
  opis?:            string;
  tip?:             string;       // 'usluga' | 'proizvod'
  cijena?:          number;
  statusObjave?:    string;
  datumKreiranja?:  string;
  kapacitet?:       number;
}
```

### KorisnikPomoci – `models/korisnik-pomoci.model.ts`

```typescript
export interface KorisnikPomoci {
  pomocId:             number;
  korisnik:            Korisnik;
  naziv:               string;
  opisPotrebe?:        string;
  brojRacuna:          string;
  dokazVerifikacije?:  string;
}
```

### Kategorija – `models/kategorija.model.ts`

```typescript
export interface Kategorija {
  kategorijaId: number;
  naziv:        string;
  opis?:        string;
}
```

### Profil – `models/profil.model.ts`

```typescript
export interface Profil {
  profilId:        number;
  korisnik:        Korisnik;
  opis?:           string;
  profilnaSlika?:  string;
  grad?:           string;
  portfolioLink?:  string;
  prosjecnaOcjena?: number;
}
```

### Donacija – `models/donacija.model.ts` *(promijenjen)*

```typescript
export interface Donacija {
  // ... ostala polja ...
  korisnikPomoci?: { pomocId: number };  // ← DODANO da izbjegnemo TS grešku
}
```

Backend vraća `korisnikPomoci` ugniježđen u donaciji, pa je bio potreban ovaj tip.

### OcjenaRecenzija – `models/ocjena-recenzija.model.ts` *(NOVO)*

```typescript
export interface KupljenaUslugaMini {
  kupovinaId:       number;
  uslugaProizvod?:  UslugaProizvod;   // Naziv usluge za prikaz u recenziji
  datumKupovine?:   string;
}

export interface OcjenaRecenzija {
  ocjenaId:        number;
  kupovina?:       KupljenaUslugaMini;  // Sadrži naziv usluge
  ocjenjivac?:     Korisnik;            // Ko je ostavio recenziju
  brojZvjezdica:   number;              // 1–5
  komentar?:       string;
  datumOcjene?:    string;
}
```

Ovaj model preslikava Java klase `OcjenaRecenzija` i `KupljenaUsluga`. Korišten `KupljenaUslugaMini` umjesto punog `KupljenaUsluga` jer mobilna aplikacija ne treba sve podatke o kupovini — samo naziv usluge.

---

## 10. Stranice – detalji implementacije

### 10.1 Tab1 – Početna strana (potpuno prepisan)

**Fajlovi:** `tab1/tab1.page.ts`, `.html`, `.scss`

#### Šta se učitava s API-ja

```typescript
ngOnInit() {
  this.ucitajSlucajeve();
}

ucitajSlucajeve() {
  this.korisnikPomociSvc.getAll().subscribe(data => {
    const top3 = [...data].sort((a, b) => b.pomocId - a.pomocId).slice(0, 3);
    this.aktivniSlucajevi = top3.map(s => ({ ...s, raised: 0, percent: 0 }));

    this.donacijaSvc.getAll().subscribe(donacije => {
      donacije.forEach(d => {
        const s = this.aktivniSlucajevi.find(c => c.pomocId === d.korisnikPomoci?.pomocId);
        if (s) s.raised += d.iznos;  // Suma donacija po slučaju
      });
      this.aktivniSlucajevi.forEach(s => {
        s.percent = Math.min(100, Math.round((s.raised / 5000) * 100)); // 5000€ cilj
      });
    });
  });
}
```

#### Statični podaci (hardkodirani)

Statistike, koraci, uloge i recenzije su hardkodirani u TypeScript jer ne postoje posebni API endpointi za njih:

```typescript
stats   = [{ value: '128', label: 'Aktivnih volontera' }, ...];
steps   = [{ icon: '...', title: '...', desc: '...' }, ...];
roles   = [{ icon: '...', title: 'Volonter', desc: '...' }, ...];
reviews = [{ initials: 'SK', text: '...', name: '...', service: '...' }, ...];
donatori = [{ naziv: 'EU', logoUrl: '...', boja: '...' }, ...]; // Partneri
```

#### Sekcije HTML stranice (redom)

1. **Hero** — Naslov "Ova ruka putuje da se sa tvojom *rukuje*", dva dugmeta, floating badge s prikupljenim iznosom
2. **Stats strip** — 4 statistike u redu (128 volontera, 45 slučajeva, 1230 transakcija, 98%)
3. **Kako funkcioniše** — 3 koraka s ikonicama i opisima
4. **Aktivni slučajevi** — Kartice iz API-ja s progress barom i iznosom donacija, klik vodi na detalje
5. **Ko može učestvovati** — 4 uloge: Volonter, Kupac, Donator, Korisnik pomoći
6. **Recenzije** — Horizontalni scroll 3 recenzije
7. **Postanite volonter CTA** — Tamno-zelena pozadina, statistike, dugme za registraciju
8. **Partneri** — Horizontalni scroll 6 logo-kartica (EU, ICT Cortex, UNDP, Mtel, TRAG, CEMI)
9. **Footer** — 3 kolone: Platforma, Kontakt, Dokumenti

#### Footer – Dokumenti kolona

```typescript
otvoriDokument(tip: string) {
  const urls: Record<string, string> = {
    faq:        'http://localhost:4200/faq',
    uslovi:     'http://localhost:4200/assets/docs/uslovi-koriscenja.pdf',
    privatnost: 'http://localhost:4200/assets/docs/politika-privatnosti.pdf',
    ugovor:     'http://localhost:4200/assets/docs/pravni-ugovor.pdf',
  };
  window.open(urls[tip], '_blank');
}
```

Dokumenti se otvaraju u pretraživaču u novom tabu. Na pravi telefon to bi bilo externi browser.

#### Logo partnera s fallback-om

```typescript
onLogoError(event: Event, kratko: string) {
  const img = event.target as HTMLImageElement;
  const wrap = img.parentElement!;
  img.style.display = 'none';
  wrap.innerHTML = `<span>${kratko}</span>`; // Prikaži inicijale ako slika ne učita
}
```

---

### 10.2 Tab2 – Usluge volontera (potpuno prepisan)

**Fajlovi:** `tab2/tab2.page.ts`, `.html`, `.scss`

#### Filtriranje kategorija

```typescript
const SKRIVENE_KATEGORIJE = [
  'zdravlje i njega', 'prevoz i transport',
  'kućni majstor', 'kucni majstor'  // Sa i bez dijakritika
];
```

Kod učitavanja se primjenjuje filtriranje i sortiranje:

```typescript
this.kategorijaSvc.getAll().subscribe(k => {
  const vidljive = k.filter(kat => !SKRIVENE_KATEGORIJE.includes(this.normalizuj(kat.naziv)));
  const ostalo   = vidljive.filter(kat => this.normalizuj(kat.naziv) === 'ostalo');
  const ostale   = vidljive.filter(kat => this.normalizuj(kat.naziv) !== 'ostalo');
  this.kategorije = [...ostale, ...ostalo]; // "Ostalo" uvijek na kraju
});
```

#### Normalizacija dijakritika za pretragu

```typescript
private normalizuj(str: string): string {
  return str.toLowerCase()
    .replace(/š/g, 's').replace(/č/g, 'c').replace(/ć/g, 'c')
    .replace(/đ/g, 'd').replace(/ž/g, 'z');
}
```

Ovo omogućava da korisnik koji ukuca `podrska` pronađe uslugu nazvanu `Podrška`. Normalizacija se primjenjuje i na upit i na podatke pri poređenju.

#### Filtriranje u pretrazi

```typescript
private primijeniFilter() {
  const upit = this.normalizuj(this.trenutniUpit);
  this.filtrirane = this.usluge.filter(u => {
    const matchUpit = !upit ||
      this.normalizuj(u.naziv).includes(upit) ||          // Po nazivu
      this.normalizuj(u.opis ?? '').includes(upit) ||     // Po opisu
      this.normalizuj(u.kategorija?.naziv ?? '').includes(upit); // Po kategoriji
    const matchKat = !this.odabranaKategorija ||
      u.kategorija?.kategorijaId === this.odabranaKategorija;
    return matchUpit && matchKat;
  });
}
```

#### Tok korisničke interakcije (dva modala)

**Klik na karticu usluge:**
```typescript
klikNaUslugu(usluga: UslugaProizvod) {
  this.odabranaUsluga = usluga;
  this.uslugaOtvorena = true;      // Otvori modal 1: Detalji usluge
}
```

**Klik na volontera unutar detalja:**
```typescript
otvoriProfilVolontera(volonter: Korisnik) {
  this.odabraniVolonter = volonter;
  this.profilOtvoren = true;       // Otvori modal 2: Profil volontera
  this.ucitavaProfil = true;

  forkJoin({
    recenzije: this.recenzijaSvc.getByVolonter(volonter.korisnikId),
    prosjek:   this.recenzijaSvc.getProsjecnaOcjena(volonter.korisnikId),
    usluge:    this.uslugaSvc.getByVolonter(volonter)
  }).subscribe({ next: (res) => {
    this.volonterRecenzije = res.recenzije;
    this.prosjecnaOcjena   = res.prosjek.prosjecnaOcjena ?? 0;
    this.volonterUsluge    = res.usluge.filter(...); // Bez skrivenih kategorija
    this.ucitavaProfil     = false;
  }});
}
```

`forkJoin` pokreće sva tri HTTP zahtjeva **paralelno** i čeka da svi završe. Rezultati su dostupni istovremeno, što smanjuje ukupno vrijeme čekanja.

#### Modal 1: Detalji usluge

Bottom-sheet (max 80% ekrana visine) s:
- Kategorija chip
- Naziv usluge (Playfair Display, 1.4rem)
- Klikabilan red s volonterom (avatar + ime + "Profil →")
- Info stavke: Cijena (€), Kapacitet, Tip usluge
- Pun opis usluge
- Dugme "Pogledaj profil volontera"
- Dugme "Zatvori"

#### Modal 2: Profil volontera

Bottom-sheet (max 90% ekrana, scrollabilan) s:
- Avatar (inicijali u teal krugu), ime, chip "Volonter"
- Prosječna ocjena (zvjezdice + broj + "(X recenzija)")
- Email, telefon (ako postoje)
- Sekcija "Recenzije" — kartice: avatar recenzenta, ime, naziv usluge, zvjezdice, komentar, datum
- Sekcija "Ostale usluge" — mini kartice ostalih usluga istog volontera, klikabilne
- Dugme "Zatvori"

---

### 10.3 Tab3 – Profil korisnika (nepromijenjen u logici)

**Fajl:** `tab3/tab3.page.ts`

```typescript
ngOnInit() {
  this.auth.currentUser$.subscribe(u => this.korisnik = u); // Reaktivno — mijenja se pri login/logout
}

async onOdjava() {
  // AlertController potvrda → auth.logout() → navigacija na /login
}
```

Tab3 koristi `AuthService.currentUser$` Observable za reaktivni prikaz podataka prijavljenog korisnika. Prikazuje ime, email, tip korisnika (mapiran u čitljiv string) i dugme za odjavu s potvrdom.

**Vizuelna izmjena:** Prepisan SCSS da odgovara Dobrobit paleti.

---

## 11. Šta je preuzeto s frontenda

Slijedeći elementi su konceptualno preuzeti s Angular web frontenda i adaptirani za Ionic:

| Što | Gdje na frontendu | Kako u mobilnoj |
|-----|-------------------|-----------------|
| Boje (#2d6b55, #c8ede4) | `styles.scss` CSS varijable | `variables.scss` Ionic override-i |
| Fontovi (Playfair, DM Sans) | Google Fonts import | Isti import u `variables.scss` |
| Hero sekcija | `home.component.html` | `tab1.page.html` s Ionic elementima |
| Stats strip | `home.component.html` | `tab1.page.html` |
| Progress bar za donacije | `.db-progress-bar` CSS | Ista klasa u `global.scss` |
| Sekcija "Partneri" | `partneri.component.html` | Ugrađeno u `tab1.page.html` |
| Footer s kolonama | `footer.component.html` | Ugrađeno u `tab1.page.html` |
| Pill kategorije | `tab2`-ekvivalent na frontendu | `ion-segment` s pill stilom |
| Diacritic normalizacija | `pretraga.service.ts` | `normalizuj()` metoda u `tab2.page.ts` |
| Cijene u € | Web frontend | `{{ u.cijena }} €` u Ionic karticama |
| Design token nazivi | `--db-teal`, `--db-mint-to` | Iste varijable preuzete 1:1 |

**Napomena o granicama dijeljenja koda:** Angular servisi i TypeScript modeli su doslovno isti (copy-paste s odgovarajućim adaptacijama putanje). HTML template-i i SCSS stilovi moraju biti pisani od nule jer Ionic koristi web komponente (`ion-card`, `ion-button`) umjesto nativnih HTML elemenata.

---

## 12. Šta je novo / dodano

### Novi fajlovi

| Fajl | Opis |
|------|------|
| `models/ocjena-recenzija.model.ts` | TypeScript interfejsi za recenzije i kupljene usluge |
| `services/ocjena-recenzija.service.ts` | HTTP pozivi prema `/api/recenzije/volonter/{id}` |

### Nove metode u postojećim servisima

| Servis | Metoda | Opis |
|--------|--------|------|
| `UslugaProizvodService` | `getByVolonter(volonter)` | POST za filtriranje usluga po volonteru |

### Novi Angular koncepti korišćeni

| Koncept | Gdje | Opis |
|---------|------|------|
| `forkJoin` (RxJS) | `tab2.page.ts` | Paralelni HTTP pozivi za profil volontera |
| Dva ugniježđena bottom-sheet modala | `tab2.page.html` | Prilagođeni modali bez `ModalController` |
| `onLogoError` handler | `tab1.page.ts` | Fallback za partnere kad logo slika ne učita |
| `formatirajDatum()` | `tab2.page.ts` | Lokalizovan prikaz datuma recenzije |
| `zvjezdicaArray()` / `praznihZvjezdica()` | `tab2.page.ts` | Generisanje niza za `*ngFor` zvjezdice |

### Izmjene u postojećim fajlovima

| Fajl | Izmjena |
|------|---------|
| `app-routing.module.ts` | Port 4300 dodan u CORS (backend) |
| `models/donacija.model.ts` | Dodano `korisnikPomoci?: { pomocId: number }` |
| `pages/register/register.page.ts` | Uklonjen tip `donator` |
| `tab1/tab1.page.*` | Potpuno prepisan — kompleksna početna strana |
| `tab2/tab2.page.*` | Potpuno prepisan — dva modala, filtriranje, pretraga |
| `tabs/tabs.page.html` | Ikonica tab1 promijenjena, label "Slučajevi" → "Početna" |
| `global.scss` | Potpuno prepisan s Dobrobit stilovima |
| `theme/variables.scss` | Potpuno prepisan s design tokenima |
| `SecurityConfig.java` | Port 4300 dodan u CORS allowed origins |

---

## 13. Komunikacija s backendom

### HTTP klijent konfiguracija

Angular `HttpClient` konfigurisan je u `app.module.ts`. Sve metode koriste `{ withCredentials: true }` koji uključuje session cookie u svaki zahtjev.

### Environment fajl – `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

Svi servisi koriste `environment.apiUrl` kao bazu, nikad hardkodiranu adresu direktno u servisu.

### Tok tipičnog zahtjeva

```
Korisnik klikne → Komponenta poziva servis.metoda()
  → HttpClient.get/post('http://localhost:8080/api/...', { withCredentials: true })
    → Pretraživač šalje CORS preflight (OPTIONS) ako je cross-origin
      → SecurityConfig potvrđuje origin (4300 je dozvoljen)
        → Backend vraća JSON
          → HttpClient mapira u TypeScript tip
            → Observable emituje vrijednost
              → Komponenta ažurira template
```

### Upravljanje greškama

Svaki `.subscribe({ error: (err) => ... })` blok hvata HTTP greške i prikazuje ili `AlertController` dialog ili resetuje stanje loadera. Nema globalnog error interceptora.

---

## 14. Poznata ograničenja

| Ograničenje | Opis | Moguće rješenje |
|-------------|------|-----------------|
| **Session reset** | Osvježavanje stranice vraća na login jer je stanje in-memory | Koristiti `localStorage` ili poziv `GET /api/me` pri startu |
| **CORS na produkciji** | `localhost:4300` je samo za razvoj | Na produkciji koristiti pravu domenu u `SecurityConfig` |
| **Dokumenti u footeru** | Linkuju na `localhost:4200` (web frontend) | Na produkciji promijeniti u stvarne URL-ove PDF-ova |
| **Partner logoi** | Dohvaćaju se s Clearbit CDN-a koji može biti nedostupan | Logoi su lokalno pohranjeni u `assets/logos/` |
| **Prosječna ocjena** | Vraća `0.0` dok nema unosa u `ocjena_recenzija` tabeli | Normalno stanje — popunit će se s podacima |
| **Statički podaci** | Statistike (128 volontera, 98%) su hardkodirane | Kreirati endpoint za agregatne statistike |
| **Auth guard** | Ne provjerava backend session — samo in-memory stanje | Implementirati `APP_INITIALIZER` s `GET /api/korisnici/me` |
