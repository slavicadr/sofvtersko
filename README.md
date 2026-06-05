# Dobrobit – Angular Frontend

Platforma za humanitarnu pomoć | Angular 17 + Spring Boot + MySQL

---

## Pokretanje projekta

```bash
npm install
ng serve
# Aplikacija dostupna na http://localhost:4200
```

---

## Struktura projekta

```
src/
├── app/
│   ├── pages/
│   │   ├── home/                  # Početna stranica
│   │   ├── login/                 # Prijava & Registracija
│   │   ├── cases/                 # Humanitarni slučajevi
│   │   ├── services/              # Usluge & Proizvodi
│   │   ├── donations/             # Javna lista donacija
│   │   ├── payment/               # Stranica za plaćanje
│   │   ├── volunteer-dashboard/   # Dashboard volontera
│   │   ├── buyer-dashboard/       # Dashboard kupca
│   │   └── admin/                 # Admin panel
│   ├── shared/
│   │   ├── navbar/                # Navigacijska traka
│   │   └── footer/                # Podnožje
│   ├── app.routes.ts              # Routing
│   ├── app.component.ts           # Root komponenta
│   └── app.config.ts              # Bootstrap konfiguracija
├── assets/
│   └── images/
│       ├── logo.png               ← DODAJTE OVDJE
│       ├── logo-white.png         ← DODAJTE OVDJE
│       ├── hero-image.png         ← DODAJTE OVDJE
│       ├── auth-illustration.png  ← DODAJTE OVDJE
│       ├── volunteer-cta.png      ← DODAJTE OVDJE
│       ├── beneficiaries/         ← Slike korisnika pomoći
│       ├── offers/                ← Slike usluga/proizvoda
│       └── avatars/               ← Avatari korisnika
├── index.html
├── main.ts
└── styles.scss                    # Globalni dizajn sistem
```

---

## Dodavanje Slika / Logo

### Logo u navbar-u
U svakoj stranici koja koristi `<app-navbar>`, proslijedite putanju:
```html
<app-navbar [logoImagePath]="'assets/images/logo.png'"></app-navbar>
```

Ili direktno u komponenti:
```typescript
logoPath = 'assets/images/logo.png';
logoWhitePath = 'assets/images/logo-white.png';
```

### Slika Hero sekcije (Početna)
```
src/assets/images/hero-image.png
```
Preporučene dimenzije: **600×500px**, transparentna pozadina (.png)

### Slike za Usluge / Ponude
Smjestite slike u:
```
src/assets/images/offers/naziv-usluge.jpg
```
Dimenzije: **400×300px** (landscape)

### Fotografije Korisnika Pomoći
```
src/assets/images/beneficiaries/ime-prezime.jpg
```
Dimenzije: **300×300px** (kvadrat, portrait)

### Avatari Korisnika
```
src/assets/images/avatars/ime.jpg
```
Dimenzije: **200×200px** (kvadrat)

---

## Rute

| Putanja | Komponenta | Opis |
|---------|-----------|------|
| `/` | HomeComponent | Početna stranica |
| `/login` | LoginComponent | Prijava |
| `/registracija` | LoginComponent | Registracija |
| `/slucajevi` | CasesComponent | Humanitarni slučajevi |
| `/usluge` | ServicesComponent | Usluge & Proizvodi |
| `/donacije` | DonationsComponent | Javna lista donacija |
| `/placanje` | PaymentComponent | Plaćanje |
| `/volonter/dashboard` | VolunteerDashboardComponent | Dashboard volontera |
| `/kupac/dashboard` | BuyerDashboardComponent | Dashboard kupca |
| `/admin/dashboard` | AdminComponent | Admin panel |

---

## Integracija sa Spring Boot API

Sve komponente koriste mock podatke. Za Spring Boot integraciju:

1. Kreirajte `src/app/core/services/` folder
2. Kreirajte Angular servise (npr. `AuthService`, `OfferService`, `TransactionService`)
3. Koristite `HttpClient` za API pozive
4. Zamijenite mock podatke u komponentama sa pozivima servisa

Primjer:
```typescript
// src/app/core/services/offer.service.ts
@Injectable({ providedIn: 'root' })
export class OfferService {
  constructor(private http: HttpClient) {}
  
  getOffers() {
    return this.http.get<Offer[]>('/api/offers');
  }
}
```

---

## Pristupačnost (Accessibility)

Dugme "Podešavanja Pristupačnosti" je implementirano kao FAB na svakoj stranici.
Za punu implementaciju (OpenDyslexic font, high contrast, daltonizam, audio),
proširite `AccessibilityService` po SRS specifikaciji (sekcija 2).

---

## Dizajn Sistem

Boje:
- `--teal: #2d6b55` – primarna zelena
- `--lime: #7ab648` – akcent
- `--mint-from: #a8ddd0` / `--mint-to: #c8ede4` – gradijenti

Fontovi:
- **Playfair Display** – naslovi
- **DM Sans** – tekst

Sve CSS varijable su u `src/styles.scss`.
