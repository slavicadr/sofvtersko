# DOBROBIT — Tehnička dokumentacija projekta
> Jezik: Crnogorski  
> Verzija: 1.0  
> Datum: Jun 2026

---

## BRZI START — Kako pokrenuti projekat

> Za detaljna uputstva (MySQL setup, application.properties, inicijalni podaci) pogledaj sekciju **15** na dnu dokumenta.

### Šta pokrenuti i kojim redoslijedom

```
1. MySQL baza         → pokreni servis (port 3306)
2. Spring Boot backend → port 8080
3. Web sajt (Angular)  → port 4200
4. Mobilna aplikacija  → port 4300  (opciono)
```

### Backend (Spring Boot)

```bash
cd sofvtersko

# Windows
mvnw.cmd spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```

Sačekaj poruku `Started DobrobitApplication` u konzoli (~30 sekundi).  
Backend je dostupan na: **http://localhost:8080**

---

### Web sajt (Angular)

```bash
cd frontend
npm install       # samo prvi put — preuzima pakete
npm start
```

Sajt je dostupan na: **http://localhost:4200**

---

### Mobilna aplikacija (Ionic)

```bash
cd mobile
npm install       # samo prvi put
npm start -- --port 4300
```

Mobilna je dostupna na: **http://localhost:4300**

---

### Kratka provjera da li sve radi

| Komponenta | URL | Šta treba da se vidi |
|------------|-----|----------------------|
| Backend | http://localhost:8080/api/kategorije | JSON niz (može biti prazan `[]`) |
| Web sajt | http://localhost:4200 | Dobrobit početna stranica |
| Mobilna | http://localhost:4300 | Login ekran s teal dizajnom |

---

## SADRŽAJ

1. [Pregled projekta](#1-pregled-projekta)
2. [Tehnološki stack](#2-tehnološki-stack)
3. [Arhitektura sistema](#3-arhitektura-sistema)
4. [Baza podataka — entiteti i relacije](#4-baza-podataka--entiteti-i-relacije)
5. [Backend — Spring Boot aplikacija](#5-backend--spring-boot-aplikacija)
6. [API endpointi — kompletna referenca](#6-api-endpointi--kompletna-referenca)
7. [Sigurnost i autentifikacija](#7-sigurnost-i-autentifikacija)
8. [Upload fajlova](#8-upload-fajlova)
9. [Email notifikacije](#9-email-notifikacije)
10. [Frontend — Angular aplikacija](#10-frontend--angular-aplikacija)
11. [Korisničke uloge i tokovi](#11-korisničke-uloge-i-tokovi)
12. [Poslovne logike i pravila](#12-poslovne-logike-i-pravila)
13. [Pokretanje projekta (kratki vodič)](#13-pokretanje-projekta)
14. [Konfiguracija](#14-konfiguracija)
15. [Postavljanje na novom računaru (detaljna uputstva)](#15-postavljanje-na-novom-računaru)

---

## 1. PREGLED PROJEKTA

**Dobrobit** je humanitarna web platforma namijenjena povezivanju volontera, kupaca/donatora i korisnika pomoći u Crnoj Gori. Platforma omogućava:

- **Volonterima** da ponude usluge i proizvode koje kupci mogu kupiti, pri čemu sav prihod ide odabranom korisniku pomoći.
- **Kupcima** da pregledaju ponude, kupe usluge i direktno doprinesu humanitarnim slučajevima.
- **Donatorima** da direktno doniraju određenim korisnicima pomoći bez registracije naloga.
- **Korisnicima pomoći** (lica ili organizacije kojima je pomoć potrebna) da prime donacije i sredstva od kupovina.
- **Administratorima** da verifikuju volontere, moderiraju ponude, prate transakcije i upravljaju cijelom platformom.

### Osnovna ideja toka novca

```
Kupac plati uslugu volontera
        ↓
Sredstva idu DIREKTNO korisniku pomoći (ne volonteru)
        ↓
Volonter prima ZAHVALNOST i potvrdu o volontiranju (certifikat)
```

---

## 2. TEHNOLOŠKI STACK

### Backend
| Tehnologija | Verzija | Namjena |
|---|---|---|
| Java | 17+ (JDK 25 u dev) | Programski jezik |
| Spring Boot | 3.4.5 | Web framework |
| Spring Security | (uključen u Boot) | Autentifikacija i autorizacija |
| Spring Data JPA | (uključen u Boot) | ORM i pristup bazi |
| Hibernate | 6.6.x | JPA implementacija |
| MySQL | 8.0.45 | Relaciona baza podataka |
| Jakarta Validation | (uključen u Boot) | Validacija unosa |
| Spring Mail | (uključen u Boot) | Slanje email-a |
| Lombok | (opcionalan) | Smanjenje boilerplate koda |
| Maven | 3.x | Build tool i upravljanje zavisnostima |

### Frontend
| Tehnologija | Verzija | Namjena |
|---|---|---|
| Angular | 17 | SPA framework |
| TypeScript | 5.x | Programski jezik |
| RxJS | 7.x | Reaktivno programiranje |
| Angular Router | (uključen) | Navigacija i lazy loading |
| Angular Forms | (uključen) | Reaktivne i template forme |
| HttpClient | (uključen) | HTTP komunikacija sa backendom |
| Bootstrap Icons | 1.x | Ikonografija (bi-*) |
| Phosphor Icons | 2.x | Ikonografija (ph-*) |
| SCSS | — | Stilizovanje |

### Infrastruktura
- **Server port (backend):** 8080
- **Dev server (frontend):** 4200
- **Baza:** MySQL, localhost:3306, baza `dobrobit1`
- **Email SMTP:** Outlook, smtp-mail.outlook.com:587

---

## 3. ARHITEKTURA SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Angular SPA)                 │
│  localhost:4200                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │  Home    │ │ Login /  │ │ Volonter │ │  Admin     │ │
│  │  Page    │ │ Register │ │Dashboard │ │ Dashboard  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST (JSON)
                       │ CORS: localhost:4200 → 8080
                       │ Session cookie (HttpOnly)
┌──────────────────────▼──────────────────────────────────┐
│              SPRING BOOT BACKEND (Port 8080)             │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Spring Security Filter Chain        │    │
│  │  (Session-based auth, Role-based access control) │    │
│  └───────────────────────┬─────────────────────────┘    │
│                           │                              │
│  ┌────────────┐  ┌────────┴───────┐  ┌───────────────┐  │
│  │Controllers │  │   Services     │  │  Repositories │  │
│  │ (REST API) │→ │(Poslovna logika│→ │ (JPA/Hibernate│  │
│  └────────────┘  └────────────────┘  └───────┬───────┘  │
│                                               │          │
└───────────────────────────────────────────────┼──────────┘
                                                │
┌───────────────────────────────────────────────▼──────────┐
│                    MySQL baza (dobrobit1)                  │
│                                                           │
│  korisnik │ volonter_info │ usluga_proizvod │             │
│  kupljena_usluga │ donacija │ kategorija │                │
│  ocjena_recenzija │ korisnik_pomoci │                     │
│  verifikacija │ log_aktivnosti │ profil                   │
└───────────────────────────────────────────────────────────┘
```

### Princip komunikacije

1. Angular šalje HTTP zahtjeve na `localhost:8080/api/*`
2. Spring Security provjerava sesiju (cookie `JSESSIONID`)
3. Controller prima zahtjev i delegira Service sloju
4. Service sadrži poslovnu logiku i poziva Repository
5. Repository komunicira sa MySQL bazom kroz Hibernate ORM
6. Odgovor se vraća kao JSON nazad Angular klijentu

---

## 4. BAZA PODATAKA — ENTITETI I RELACIJE

Hibernate je konfigurisan sa `ddl-auto=update`, što znači da automatski kreira i ažurira tabele na osnovu Java klasa pri pokretanju aplikacije.

### 4.1 Tabela: `korisnik`

Centralna tabela — svaki korisnik sistema (bez obzira na ulogu) ima zapis ovdje.

| Kolona | Tip | Opis |
|---|---|---|
| `korisnik_id` | INT (PK, AUTO) | Primarni ključ |
| `ime` | VARCHAR | Ime korisnika |
| `prezime` | VARCHAR | Prezime korisnika |
| `email` | VARCHAR (UNIQUE) | Email adresa — jedinstven identifikator |
| `lozinka_hash` | VARCHAR | BCrypt hash lozinke |
| `telefon` | VARCHAR | Broj telefona (opciono) |
| `adresa` | VARCHAR | Adresa (opciono) |
| `naziv` | VARCHAR | Naziv (za organizacije) |
| `opis` | TEXT | Biografija / opis volontera |
| `prikaz_anonimno` | BOOLEAN | Da li se korisnik prikazuje anonimno |
| `tip_korisnika` | ENUM | `volonter`, `kupac`, `donator`, `korisnik_pomoci`, `administrator` |
| `status_naloga` | ENUM | `na_cekanju`, `aktivan`, `suspendovan`, `uklonjen` |
| `datum_registracije` | DATETIME | Datum i vrijeme registracije |
| `verifikovan` | BOOLEAN | Da li je nalog verifikovan od admina |
| `razlog_promjene_statusa` | TEXT | Razlog zadnje promjene statusa |

**Napomene:**
- Kolona `email` ima `UNIQUE` constraint — duplikati su onemogućeni na nivou baze.
- `lozinka_hash` se nikad ne vraća u JSON odgovoru (`@JsonProperty(WRITE_ONLY)`).
- `tip_korisnika` određuje koja prava korisnik ima (mapira se na Spring Security role).
- Volonter koji je na `na_cekanju` statusu NE može se prijaviti (Spring Security `isEnabled()` vraća `false` ako nije `verifikovan`).
- `portfolioLinkTemp` i `cvUrlTemp` su `@Transient` polja — postoje samo u Java objektu tokom registracije i ne čuvaju se u ovoj tabeli.

**Relacije:**
- Jedan `Korisnik` može imati jedan `VolonterInfo` (1:1)
- Jedan `Korisnik` može imati više `UslugaProizvod` zapisa (1:N, kao volonter)
- Jedan `Korisnik` može imati više `KupljenaUsluga` zapisa (1:N, kao kupac)
- Jedan `Korisnik` može biti `ocjenjivac` u više `OcjenaRecenzija` (1:N)

---

### 4.2 Tabela: `volonter_info`

Prošireni profil koji postoji samo za korisnike tipa `volonter`. Kreira se automatski pri registraciji volontera.

| Kolona | Tip | Opis |
|---|---|---|
| `volonter_id` | INT (PK, AUTO) | Primarni ključ |
| `korisnik_id` | INT (FK → korisnik) | Referenca na Korisnik — UNIQUE |
| `biografija` | TEXT | Detaljni opis volontera |
| `portfolio_link` | VARCHAR | URL do portfolio stranice |
| `cv_url` | VARCHAR | Putanja do uploadovanog CV PDF fajla |
| `broj_usluga` | INT | Broj realizovanih (završenih) usluga |

**Napomene:**
- `broj_usluga` se automatski povećava za 1 svaki put kad se usluga označi kao `realizovano`.
- `cv_url` sadrži relativnu putanju tipa `/api/upload/cv/{filename}`.

---

### 4.3 Tabela: `usluga_proizvod`

Svaka usluga ili proizvod koji volonter nudi na platformi.

| Kolona | Tip | Opis |
|---|---|---|
| `usluga_proizvod_id` | INT (PK, AUTO) | Primarni ključ |
| `volonter_id` | INT (FK → korisnik) | Volonter koji nudi uslugu |
| `kategorija_id` | INT (FK → kategorija) | Kategorija usluge |
| `naziv` | VARCHAR | Naziv usluge/proizvoda |
| `opis` | TEXT | Detaljan opis |
| `tip` | VARCHAR | `usluga` ili `proizvod` |
| `cijena` | DECIMAL | Cijena u EUR |
| `status_objave` | VARCHAR | `na_cekanju`, `aktivna`, `popunjeno`, `odbijena`, `uklonjena` |
| `datum_kreiranja` | DATETIME | Datum kreiranja |
| `kapacitet` | INT | Maksimalni broj kupovina (NULL = neograničeno) |

**Status tok:**
```
Kreiranje → na_cekanju
Admin odobri → aktivna
Kapacitet popunjen → popunjeno (automatski)
Admin odbije → odbijena
Admin/Volonter ukloni → uklonjena
```

**Prava brisanja:**
- Može se obrisati **samo** ako nema nijedne kupovine.
- Ako ima aktivnih (nerealizovanih) kupovina → greška.
- Ako ima realizovanih kupovina (istorija) → greška (FK constraint).

---

### 4.4 Tabela: `kategorija`

Kategorije usluga i proizvoda.

| Kolona | Tip | Opis |
|---|---|---|
| `kategorija_id` | INT (PK, AUTO) | Primarni ključ |
| `naziv` | VARCHAR (UNIQUE) | Naziv kategorije |
| `opis` | TEXT | Opis kategorije |

**Napomene:**
- Ako volonter unese novu kategoriju pri kreiranju usluge, sistem je automatski kreira ako ne postoji.
- Nove kategorije koje predloži volonter idu na odobrenje adminu.

---

### 4.5 Tabela: `kupljena_usluga`

Svaka transakcija — kupovina usluge od strane kupca za određenog korisnika pomoći.

| Kolona | Tip | Opis |
|---|---|---|
| `kupovina_id` | INT (PK, AUTO) | Primarni ključ |
| `donator_id` | INT (FK → korisnik) | Kupac koji je platio |
| `usluga_proizvod_id` | INT (FK → usluga_proizvod) | Kupljena usluga |
| `pomoc_id` | INT (FK → korisnik_pomoci) | Korisnik pomoći koji prima benefit |
| `iznos` | DECIMAL | Iznos plaćanja |
| `datum_kupovine` | DATETIME | Datum kupovine |
| `status_placanja` | VARCHAR | `placeno`, `na_cekanju` |
| `nacin_placanja` | VARCHAR | `KARTICA`, `GOTOVINA`, itd. |
| `referenca_placanja` | VARCHAR | Referentni broj transakcije |
| `status_isporuke` | VARCHAR | `na_cekanju`, `realizovano` |
| `datum_realizacije` | DATETIME | Kada je usluga realizovana |

**Status tok isporuke:**
```
Kupovina kreirana → status_isporuke: na_cekanju
Kupac/Volonter/Admin označi završenim → status_isporuke: realizovano
```

**Napomene:**
- Kada `status_isporuke` postane `realizovano`, automatski se poziva `uvecajBrojUsluga()` za volontera.
- Certifikat o volontiranju je dostupan samo za kupovine sa statusom `realizovano`.

---

### 4.6 Tabela: `donacija`

Direktne donacije bez kupovine usluge.

| Kolona | Tip | Opis |
|---|---|---|
| `donacija_id` | INT (PK, AUTO) | Primarni ključ |
| `donator_id` | INT (FK → korisnik) | Donator |
| `korisnik_pomoci_id` | INT (FK → korisnik_pomoci) | Primalac donacije |
| `iznos` | DECIMAL | Iznos donacije |
| `status_donacije` | VARCHAR | Status donacije |
| `status_placanja` | VARCHAR | `placeno`, `na_cekanju` |
| `nacin_placanja` | VARCHAR | Način plaćanja |
| `datum_donacije` | DATETIME | Datum donacije |
| `anonimno` | BOOLEAN | Da li se donator prikazuje anonimno |

---

### 4.7 Tabela: `korisnik_pomoci`

Korisnici pomoći — lica ili organizacije koje primaju donacije i benefite od kupovina.

| Kolona | Tip | Opis |
|---|---|---|
| `pomoc_id` | INT (PK, AUTO) | Primarni ključ |
| `korisnik_id` | INT (FK → korisnik) | Vezan korisnik nalog (opciono) |
| `naziv` | VARCHAR | Naziv/ime korisnika pomoći |
| `opis_potrebe` | TEXT | Opis situacije i potreba |
| `broj_racuna` | VARCHAR | Broj bankovnog računa |
| `dokaz_verifikacije` | TEXT | Dokument koji dokazuje potrebu |
| `status_slucaja` | VARCHAR | `aktivan`, `neaktivan`, `zavrsen` — vidljivost na javnoj stranici |

**Status `status_slucaja`:**
- `aktivan` — slučaj je vidljiv na javnoj stranici (`GET /api/korisnici-pomoci`)
- `neaktivan` / `zavrsen` — slučaj je skriven od javnosti; vidljiv samo adminu (`GET /api/korisnici-pomoci/admin/svi`)

**Brisanje:**
- Brisanje je **fizičko** (hard delete) — zapis se trajno briše iz baze
- Prije brisanja, kaskadno se brišu sve vezane `donacija` i `kupljena_usluga` zapisi (`ON DELETE CASCADE` na FK constraintima)
- Brisanje je moguće samo putem admin endpointa (`DELETE /api/korisnici-pomoci/admin/{id}`)

---

### 4.8 Tabela: `partner`

Partneri i sponzori platforme — prikazuju se na javnoj stranici.

| Kolona | Tip | Opis |
|---|---|---|
| `id` | INT (PK, AUTO) | Primarni ključ |
| `naziv` | VARCHAR | Puno ime partnera (npr. "Evropska Unija") |
| `kratko` | VARCHAR | Kratice za fallback logo (npr. "EU") |
| `opis` | TEXT | Kratak opis partnera |
| `logo_url` | VARCHAR | URL do loga (vanjski link ili `/uploads/logovi/...`) |
| `website` | VARCHAR | URL zvanične stranice partnera |
| `kategorija` | VARCHAR | Kategorija (npr. "Međunarodna organizacija") |
| `redoslijed` | INT | Redosljed prikazivanja (manji broj = prvi) |

**Napomene:**
- Logo se može uploadovati direktno na server (`POST /api/upload/logo`) ili se može unijeti vanjski URL
- Uploadovani logoi se čuvaju u: `C:\Users\<korisnik>\dobrobit-uploads\logovi\`
- Upravljanje partnerima je dostupno samo administratoru

---

### 4.9 Tabela: `pomogli_slucaj`

Kratke priče / kartice o korisnicima kojima je platforma pomogla — prikazuju se na javnoj stranici.

| Kolona | Tip | Opis |
|---|---|---|
| `id` | INT (PK, AUTO) | Primarni ključ |
| `naslov` | VARCHAR | Ime osobe / naziv slučaja |
| `tekst` | TEXT | Kratka priča o tome kako je platforma pomogla |
| `boja` | VARCHAR | Boja kartice (`roza1`, `plava1`, `zelena1`, itd.) |
| `redoslijed` | INT | Redosljed prikazivanja |

**Napomene:**
- Kartice su vidljive na javnoj stranici na ruti `/slucajevi-kojima-smo-pomogli`
- Admin može dodavati, uređivati i brisati kartice iz CMS-a

---

### 4.10 Tabela: `ocjena_recenzija`

Recenzije koje kupci ostavljaju nakon kupovine usluge.

| Kolona | Tip | Opis |
|---|---|---|
| `ocjena_id` | INT (PK, AUTO) | Primarni ključ |
| `kupovina_id` | INT (FK → kupljena_usluga, UNIQUE) | Na koju kupovinu se odnosi |
| `ocjenjivac_id` | INT (FK → korisnik) | Ko je ostavio recenziju |
| `broj_zvjezdica` | INT | Ocjena 1–5 |
| `komentar` | TEXT | Tekstualni komentar |
| `datum_ocjene` | DATETIME | Datum ocjenjivanja |

**Napomene:**
- `kupovina_id` ima `UNIQUE` constraint — jedna kupovina = jedna recenzija.
- Samo kupac koji je platio tu kupovinu može ostaviti recenziju.
- Administrator može obrisati neprimjerene recenzije.

---

### 4.11 Tabela: `verifikacija`

Log verifikacionih akcija administratora.

| Kolona | Tip | Opis |
|---|---|---|
| `verifikacija_id` | INT (PK, AUTO) | Primarni ključ |
| `korisnik_id` | INT (FK → korisnik) | Ko se verifikuje |
| `usluga_proizvod_id` | INT (FK) | Koja usluga se verifikuje (opciono) |
| `administrator_id` | INT (FK → korisnik) | Admin koji vrši verifikaciju |
| `tip_verifikacije` | VARCHAR | Tip provjere |
| `status` | VARCHAR | Status verifikacije |
| `napomena` | TEXT | Napomena admina |
| `datum_verifikacije` | DATETIME | Datum verifikacije |

---

### 4.12 Tabela: `log_aktivnosti`

Sistemski log svih važnih akcija (prijave, odjave, promjene).

| Kolona | Tip | Opis |
|---|---|---|
| `log_id` | INT (PK, AUTO) | Primarni ključ |
| `korisnik_id` | INT (FK → korisnik) | Ko je izvršio akciju |
| `tip_aktivnosti` | VARCHAR | `LOGIN`, `LOGOUT`, `LOGIN_NEUSPIO`, itd. |
| `detalji` | TEXT | Dodatni detalji |
| `ip_adresa` | VARCHAR | IP adresa korisnika |
| `vrijeme_aktivnosti` | DATETIME | Tačno vrijeme |

---

### 4.13 Pravila brisanja podataka

Brisanje u sistemu dijeli se na dva tipa, zavisno od entiteta:

#### A) Meko brisanje (soft delete) — volonteri i korisnici

Volonter se **nikad ne briše fizički** iz baze. Umjesto toga, admin u CMS-u može promijeniti status na `uklonjen`:

```
Admin klikne "Ukloni" volontera
        ↓
PUT /api/korisnici/{id}/status { noviStatus: "uklonjen" }
        ↓
Backend:
  - status_naloga = 'uklonjen'
  - verifikovan = false  (onemogućava prijavu)
  - email → anonymizovan: "uklonjen_<id>_<timestamp>@deleted.local"
        ↓
Zapis ostaje u bazi — historija kupovina i recenzija ostaje netaknuta
Email adresa je oslobođena — isti email se može ponovo registrovati
```

**Zašto anonymizacija emaila?**
Kolona `email` ima `UNIQUE` constraint u bazi. Bez anonymizacije, bivši volonter ne bi mogao kreirati novi nalog istim emailom jer bi baza prijavila duplikat. Postavljanjem emaila na jedinstveni `deleted.local` format, originalni email se oslobađa za ponovnu upotrebu.

**Status `uklonjen` je finalan** — jednom uklonjen korisnik ne može biti reaktiviran.

#### B) Fizičko brisanje s kaskadnom propagacijom — korisnici pomoći

Slučajevi korisnika pomoći brišu se fizički. Zahvaljujući `ON DELETE CASCADE` na stranim ključevima:

```
DELETE FROM korisnik_pomoci WHERE pomoc_id = X
        ↓ automatski kaskadno briše:
  - donacija WHERE korisnik_pomoci_id = X
  - kupljena_usluga WHERE pomoc_id = X
```

Ovo osigurava referentni integritet — ne mogu ostati "siročad" zapisi koji bi upućivali na nepostojeći slučaj.

#### C) Fizičko brisanje bez kaskade — partneri i kartice "Pomogli smo"

Tabele `partner` i `pomogli_slucaj` nemaju FK veze prema drugim tabelama. Brisanje je jednostavno `DELETE FROM ...` bez kaskadnih efekata.

#### D) Brisanje usluge/proizvoda

Usluga se može fizički obrisati **samo** ako nema nijedne kupovine:

```
DELETE /api/usluge-proizvodi/{id}
        ↓
Backend provjera:
  - Postoje aktivne (nerealizovane) kupovine? → GREŠKA, blokada
  - Postoje realizovane kupovine (istorija)? → GREŠKA (FK constraint)
  - Nema nijedne kupovine → fizičko brisanje OK
```

Preporučena alternativa brisanju je postavljanje statusa na `uklonjena` — usluga ostaje u bazi kao historijski zapis ali nije vidljiva kupcima.

---

### Dijagram relacija (ER)

```
korisnik (1) ─────────── (1) volonter_info
    │
    ├─ (1) ─── (N) usluga_proizvod ─── (N:1) kategorija
    │                  │
    │                  └─ (1) ─── (N) kupljena_usluga ─── (N:1) korisnik_pomoci
    │                                       │
    │                                       └─ (1:1) ocjena_recenzija
    │
    ├─ (1) ─── (N) donacija ──────────────────── (N:1) korisnik_pomoci
    │
    ├─ (1) ─── (N) log_aktivnosti
    │
    └─ (1) ─── (N) verifikacija

partner          (nezavisna tabela)
pomogli_slucaj   (nezavisna tabela)
```

**Kaskadna brisanja (ON DELETE CASCADE):**
- `kupljena_usluga.pomoc_id` → brisanje `korisnik_pomoci` briše i kupovine
- `donacija.korisnik_pomoci_id` → brisanje `korisnik_pomoci` briše i donacije

---

## 5. BACKEND — SPRING BOOT APLIKACIJA

### 5.1 Struktura paketa

```
com.fakultet.dobrobit/
├── DobrobitApplication.java          # Main klasa, ulazna tačka
├── config/
│   └── SecurityConfig.java           # Spring Security konfiguracija
├── controllers/                      # REST kontroleri (primaju HTTP zahtjeve)
│   ├── KorisnikController.java
│   ├── VolonterInfoController.java
│   ├── UslugaProizvodController.java
│   ├── KupljenaUslugaController.java
│   ├── DonacijaController.java
│   ├── KorisnikPomociController.java
│   ├── OcjenaRecenzijaController.java
│   ├── KategorijaController.java
│   ├── VerifikacijaController.java
│   ├── ProfilController.java
│   ├── LogAktivnostiController.java
│   └── FileUploadController.java
├── services/                         # Poslovna logika
│   ├── KorisnikServices.java
│   ├── VolonterInfoService.java
│   ├── UslugaProizvodService.java
│   ├── KupljenaUslugaService.java
│   ├── DonacijaService.java
│   ├── KorisnikPomociService.java (ako postoji)
│   ├── OcjenaRecenzijaService.java
│   ├── KategorijaService.java
│   ├── VerifikacijaService.java
│   ├── EmailService.java
│   ├── LogAktivnostiService.java
│   └── KorisnikDetailsService.java   # Spring Security UserDetailsService
├── repositories/                     # JPA repozitorijumi (pristup bazi)
│   ├── KorisnikRepository.java
│   ├── VolonterInfoRepository.java
│   ├── UslugaProizvodRepository.java
│   ├── KupljenaUslugaRepository.java
│   ├── DonacijaRepository.java
│   ├── KorisnikPomociRepository.java
│   ├── OcjenaRecenzijaRepository.java
│   ├── KategorijaRepository.java
│   ├── VerifikacijaRepository.java
│   └── LogAktivnostiRepository.java
├── models/                           # JPA entiteti (tabele u bazi)
│   ├── Korisnik.java
│   ├── VolonterInfo.java
│   ├── UslugaProizvod.java
│   ├── KupljenaUsluga.java
│   ├── Donacija.java
│   ├── KorisnikPomoci.java
│   ├── OcjenaRecenzija.java
│   ├── Kategorija.java
│   ├── Verifikacija.java
│   ├── LogAktivnosti.java
│   └── Profil.java
└── enums/
    ├── TipKorisnika.java             # volonter, kupac, donator, korisnik_pomoci, administrator
    └── StatusNaloga.java             # na_cekanju, aktivan, suspendovan, uklonjen
```

### 5.2 Sloj repozitorijuma (Repository)

Svaki repozitorijum je Java interfejs koji nasljeđuje `JpaRepository`. Spring Data JPA automatski generiše SQL upite na osnovu naziva metoda.

**Primjeri iz koda:**
```java
// KorisnikRepository
Optional<Korisnik> findByEmail(String email);
boolean existsByEmail(String email);
List<Korisnik> findByTipKorisnika(TipKorisnika tip);

// OcjenaRecenzijaRepository
List<OcjenaRecenzija> findByKupovina_UslugaProizvod_Volonter_KorisnikId(int volonterId);
// ↑ Spring kreira JOIN upita: recenzija → kupovina → usluga → volonter → korisnikId

// KupljenaUslugaRepository
long countByUslugaProizvod(UslugaProizvod uslugaProizvod);
List<KupljenaUsluga> findByUslugaProizvod_Volonter(Korisnik volonter);
```

### 5.3 Sloj servisa (Service)

Servisi sadrže svu poslovnu logiku. Kontroleri ne smiju imati poslovnu logiku — samo primaju HTTP zahtjev, pozivaju servis i vraćaju odgovor.

**KorisnikServices:**
- `registrujKorisnika()` — provjera duplikata emaila, enkodiranje lozinke, kreiranje VolonterInfo ako je volonter
- `registrujKupca()` — poziva `registrujKorisnika()` + odmah postavlja status na aktivan
- `login()` — Spring Security autentifikacija, logovanje
- `promijeniStatus()` — admin akcija, šalje email notifikaciju

**KupljenaUslugaService:**
- `kupiUslugu()` — validacija, kreiranje kupovine, auto-deaktivacija kad se popuni kapacitet
- `oznaciRealizovano()` — provjera prava (kupac/volonter/admin), poziva `uvecajBrojUsluga()`

**VolonterInfoService:**
- `istaknuti(limit)` — izračunava score = avgOcjena × 2 + brojUsluga × 0.5, sortira i vraća top N

**UslugaProizvodService:**
- `obrisi()` — provjerava kupovine (nerealizovane → blokira, postoje kupovine → blokira FK)

---

## 6. API ENDPOINTI — KOMPLETNA REFERENCA

Svi endpointi imaju prefiks `/api/`. Backend se pokreće na portu `8080`.

### 6.1 Korisnici `/api/korisnici`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| POST | `/registracija` | Javno | Registracija volontera |
| POST | `/registracija/kupac` | Javno | Registracija kupca (odmah aktivan) |
| POST | `/registracija/prviAdmin` | Javno | Registracija prvog admina (jednom) |
| POST | `/login` | Javno | Prijava — vraća Korisnik objekat i postavlja sesijsku kolačić |
| POST | `/logout` | Autentifikovani | Odjava, poništava sesiju |
| GET | `/` | Admin | Lista svih korisnika |
| GET | `/{id}` | Admin | Jedan korisnik po ID |
| GET | `/tip/{tip}` | Admin | Korisnici po tipu uloge |
| GET | `/status/{status}` | Admin | Korisnici po statusu naloga |
| PUT | `/{id}/status` | Admin | Promjena statusa naloga |
| DELETE | `/{id}` | Admin | Brisanje korisnika |
| GET | `/provjeri-email?email=` | Javno | Provjera da li email postoji |

**Tijelo zahtjeva za registraciju volontera:**
```json
{
  "ime": "Marko",
  "prezime": "Jovanović",
  "email": "marko@example.com",
  "lozinkaHash": "tajna123",
  "telefon": "+38269123456",
  "tipKorisnika": "volonter",
  "opis": "Informatičar sa 5 godina iskustva",
  "portfolioLinkTemp": "https://linkedin.com/in/marko",
  "cvUrlTemp": "/api/upload/cv/uuid_cv.pdf"
}
```

**Tijelo zahtjeva za login:**
```json
{
  "email": "marko@example.com",
  "lozinka": "tajna123"
}
```

---

### 6.2 Usluge i Proizvodi `/api/usluge-proizvodi`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Sve usluge i proizvodi |
| POST | `/` | Volonter | Kreiranje nove usluge (status: na_cekanju) |
| GET | `/pretraga?naziv=` | Javno | Pretraga po nazivu |
| POST | `/filter-volonter` | Javno | Filtriranje po volonteru (body: `{korisnikId}`) |
| POST | `/filter-kategorija` | Javno | Filtriranje po kategoriji (body: `{kategorijaId}`) |
| PATCH | `/{id}/status` | Admin/Volonter | Promjena statusa objave |
| DELETE | `/{id}` | Volonter | Brisanje (samo ako nema kupovina) |

**Tijelo zahtjeva za kreiranje usluge:**
```json
{
  "volonter": { "korisnikId": 5 },
  "kategorija": { "naziv": "Edukacija" },
  "naziv": "Online lekcije matematike",
  "opis": "Pomažem učenicima od 1. do 8. razreda",
  "tip": "usluga",
  "cijena": 20.00,
  "kapacitet": 10
}
```

---

### 6.3 Kupovine `/api/kupovine`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Sve kupovine |
| POST | `/kupi` | Autentifikovani | Kupovina usluge |
| GET | `/kupac/{kupacId}` | Javno | Kupovine određenog kupca |
| GET | `/pomoc/{pomocId}` | Javno | Kupovine za korisnika pomoći |
| GET | `/volonter/{volonterId}` | Volonter/Admin | Prodaje određenog volontera |
| PATCH | `/{id}/status` | Javno | Promjena statusa plaćanja |
| PATCH | `/{id}/realizovano` | Autentifikovani | Označi uslugu kao završenu |
| GET | `/{id}/certifikat` | — | (Certifikat se generiše na frontendu) |

**Tijelo zahtjeva za kupovinu:**
```json
{
  "kupacId": 3,
  "uslugaId": 7,
  "pomocId": 2,
  "nacinPlacanja": "KARTICA",
  "iznos": 20.00
}
```

---

### 6.4 Recenzije `/api/recenzije`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Sve recenzije |
| GET | `/usluga/{uslugaId}` | Javno | Recenzije za određenu uslugu |
| GET | `/kupac/{kupacId}` | Javno | Recenzije određenog kupca |
| GET | `/volonter/{volonterId}` | Javno | Sve recenzije za usluge volontera |
| GET | `/volonter/{volonterId}/prosjek` | Javno | Prosječna ocjena volontera |
| POST | `/dodaj` | Autentifikovani | Dodavanje recenzije |
| DELETE | `/{id}` | Admin | Brisanje recenzije |

**Tijelo zahtjeva za dodavanje recenzije:**
```json
{
  "kupovinaId": 12,
  "kupacId": 3,
  "brojZvjezdica": 5,
  "komentar": "Odlično! Veoma profesionalan volonter."
}
```

---

### 6.5 Donacije `/api/donacije`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Sve donacije |
| POST | `/` | Javno | Direktna donacija (bez registracije) |

---

### 6.6 Volonter Info `/api/volonter-info`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Svi volonterski profili |
| GET | `/aktivni` | Javno | Volonteri koji su imali realizovanih usluga |
| GET | `/istaknuti?limit=5` | Javno | Top N volontera po ocjeni i broju usluga |
| GET | `/{volonterId}/dashboard` | Javno | Dashboard podaci volontera |
| POST | `/` | Volonter/Admin | Kreiranje volonterskog profila |
| PUT | `/{volonterId}` | Volonter/Admin | Ažuriranje biografije i portfolio linka |
| DELETE | `/{id}` | Admin | Brisanje volonterskog profila |

**Odgovor `/istaknuti`:**
```json
[
  {
    "volonterId": 5,
    "ime": "Ana",
    "prezime": "Perić",
    "opis": "Pravnica sa 3 godine iskustva",
    "brojUsluga": 12,
    "avgRating": 4.8,
    "score": 15.6
  }
]
```

---

### 6.7 Korisnici Pomoći `/api/korisnici-pomoci`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Svi korisnici pomoći |
| POST | `/` | Javno (privremeno) | Kreiranje novog korisnika pomoći |

---

### 6.8 Kategorije `/api/kategorije`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Javno | Sve kategorije |
| POST | `/` | Admin | Kreiranje kategorije |
| DELETE | `/{id}` | Admin | Brisanje kategorije |

---

### 6.9 Upload fajlova `/api/upload`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| POST | `/cv` | Javno | Upload CV PDF fajla (max 15 MB) |
| GET | `/cv/{filename}` | Javno | Preuzimanje/prikaz CV fajla |

---

### 6.10 Verifikacije `/api/verifikacije`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Admin | Sve verifikacije |
| POST | `/` | Admin | Kreiranje verifikacionog zapisa |

---

### 6.11 Logovi Aktivnosti `/api/log-aktivnosti`

| Metod | Putanja | Pristup | Opis |
|---|---|---|---|
| GET | `/` | Admin | Svi logovi |

---

## 7. SIGURNOST I AUTENTIFIKACIJA

### 7.1 Mehanizam autentifikacije

Sistem koristi **session-based autentifikaciju** (ne JWT tokene). Ovo znači:

1. Korisnik šalje POST `/api/korisnici/login` sa emailom i lozinkom
2. Spring Security provjerava kredencijale koristeći `BCryptPasswordEncoder`
3. Ako su ispravni, kreira se HTTP sesija i `SecurityContext` se čuva u sesiji
4. Browser automatski šalje `JSESSIONID` kolačić sa svakim narednim zahtjevom
5. Spring Security čita kolačić, pronalazi sesiju i zna ko je prijavljen

### 7.2 Lozinke

Lozinke se **nikada ne čuvaju u plain tekstu**. Koristi se BCrypt algoritam:
```
"tajna123" → "$2a$10$K/vbzHJQGNpd3wqZFHSHZe..."
```
Nije moguće dekodovati hash nazad u originalnu lozinku. Provjera se vrši poređenjem BCrypt hash-eva.

### 7.3 Kontrola pristupa

Spring Security konfiguracija (`SecurityConfig.java`) definiše ko može pristupiti kom endpointu:

**Javno dostupno (bez prijave):**
- Sve GET rute za usluge, volontere, kategorije, donacije, recenzije
- Registracija i login
- Upload/download CV fajlova
- Provjera dostupnosti emaila

**Samo autentifikovani korisnici:**
- Kupovina usluga
- Označavanje usluge kao realizovane
- Dodavanje recenzija
- Profil endpointi

**Samo volonter:**
- Kreiranje novih usluga (`POST /api/usluge-proizvodi`)
- Brisanje sopstvenih usluga
- Ažuriranje VolonterInfo profila

**Samo administrator:**
- Sve verifikacije (`/api/verifikacije/**`)
- Brisanje korisnika
- Promjena statusa korisnika
- Pregled svih korisnika
- Brisanje recenzija

### 7.4 Role u sistemu

Rola se automatski mapira iz `tipKorisnika`:
```java
"ROLE_" + tipKorisnika.name()
// volonter → ROLE_volonter
// administrator → ROLE_administrator
// kupac → ROLE_kupac
```

### 7.5 Aktivacija naloga

- Volonter se **ne može prijaviti** dok administrator ne odobri profil.
- `isEnabled()` metod u `Korisnik.java` vraća `verifikovan` polje.
- Kupac je **odmah aktivan** pri registraciji (`verifikovan = true`).

### 7.6 CORS konfiguracija

Backend dozvoljava zahtjeve samo sa `http://localhost:4200`:
```java
config.setAllowedOrigins(List.of("http://localhost:4200"));
config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
config.setAllowCredentials(true); // potrebno za kolačiće sesije
```

---

## 8. UPLOAD FAJLOVA

### 8.1 CV Upload

**Putanja endpointa:** `POST /api/upload/cv`

**Proces:**
1. Frontend šalje `multipart/form-data` zahtjev sa PDF fajlom
2. Backend provjerava:
   - Fajl nije prazan
   - `Content-Type` je `application/pdf`
   - Veličina je ≤ 15 MB
3. Generiše se jedinstveni naziv: `UUID_originalniNaziv.pdf`
4. Fajl se čuva na: `C:\Users\win11pro\dobrobit-uploads\cv\`
5. Vraća se JSON: `{ "url": "/api/upload/cv/uuid_naziv.pdf" }`

**Spring Boot limite:**
```properties
spring.servlet.multipart.max-file-size=15MB
spring.servlet.multipart.max-request-size=16MB
```

**Sigurnost naziva fajla:**
```java
filename = filename.replaceAll("[^a-zA-Z0-9._-]", "");
// Sprječava path traversal napade
```

**Preuzimanje:** `GET /api/upload/cv/{filename}` — vraća PDF sa `Content-Disposition: inline`

---

## 9. EMAIL NOTIFIKACIJE

Sistem automatski šalje email obavještenja koristeći Outlook SMTP server:

| Događaj | Primač | Sadržaj |
|---|---|---|
| Registracija | Novi korisnik | Potvrda registracije, obavještenje o verifikaciji |
| Admin odobri nalog | Volonter | Obavještenje da je profil odobren |
| Admin promijeni status | Korisnik | Obavještenje o novom statusu i razlogu |

**Konfiguracija:**
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=dobrobit2026@outlook.com
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 10. FRONTEND — ANGULAR APLIKACIJA

### 10.1 Struktura aplikacije

```
frontend/src/app/
├── app.routes.ts                    # Sve rute sa lazy loading-om
├── app.config.ts                    # Bootstrap konfiguracija
├── core/
│   ├── models/
│   │   └── models.ts               # TypeScript interfejsi za sve modele
│   ├── services/
│   │   ├── auth.service.ts         # Prijava, odjava, registracija
│   │   ├── usluga.service.ts       # CRUD za usluge
│   │   ├── kupovina.service.ts     # Kupovine i realizacija
│   │   ├── donacija.service.ts     # Donacije
│   │   ├── korisnik-pomoci.service.ts  # Korisnici pomoći
│   │   ├── admin.service.ts        # Admin operacije
│   │   └── accessibility.service.ts   # Pristupačnost
│   ├── guards/
│   │   └── auth.guard.ts           # Zaštita ruta (roleGuard)
│   └── interceptors/
│       └── credentials.interceptor.ts # Dodaje credentials: 'include' svim zahtjevima
├── pages/
│   ├── home/                       # Početna stranica
│   ├── login/                      # Prijava i registracija
│   ├── services/                   # Pregled ponuda (javno)
│   ├── cases/                      # Humanitarni slučajevi
│   ├── donations/                  # Donacije
│   ├── payment/                    # Plaćanje
│   ├── thank-you/                  # Hvala stranica
│   ├── about/                      # O platformi
│   ├── faq/                        # Česta pitanja
│   ├── volunteer-dashboard/        # Panel volontera
│   ├── buyer-dashboard/            # Panel kupca
│   └── admin/                      # Admin panel
└── shared/
    ├── navbar/                     # Navigaciona traka
    └── footer/                     # Podnožje stranice
```

### 10.2 Rutiranje (app.routes.ts)

Sve stranice su **lazy-loaded** — Angular učitava kod samo kad je potreban.

| Ruta | Komponenta | Zaštita |
|---|---|---|
| `/` | HomeComponent | Javno |
| `/login` | LoginComponent | Javno |
| `/usluge` | ServicesComponent | Javno |
| `/slucajevi` | CasesComponent | Javno |
| `/donacije` | DonationsComponent | Javno |
| `/placanje` | PaymentComponent | Javno |
| `/hvala` | ThankYouComponent | Javno |
| `/o-nama` | AboutComponent | Javno |
| `/faq` | FaqComponent | Javno |
| `/volonter/dashboard` | VolunteerDashboardComponent | Role: volonter |
| `/kupac/dashboard` | BuyerDashboardComponent | Role: kupac |
| `/admin/dashboard` | AdminComponent | Role: administrator |

### 10.3 AuthService

Centralni servis za upravljanje autentifikacijom:

```typescript
// Čuva korisnika u SessionStorage (ne ostaje nakon zatvaranja tab-a)
sessionStorage.setItem('dobrobit_user', JSON.stringify(user));

// Provjera uloge
get role(): string { return this.userSubject.value?.tipKorisnika ?? ''; }

// Usmjeravanje na odgovarajući dashboard
getDashboardRoute(): string {
  kupac → '/kupac/dashboard'
  volonter → '/volonter/dashboard'
  administrator → '/admin/dashboard'
}
```

### 10.4 Interceptor za sesiju

`credentials.interceptor.ts` automatski dodaje `withCredentials: true` svim HTTP zahtjevima, što je neophodno da browser šalje JSESSIONID kolačić:

```typescript
// Bez ovoga sesija ne bi radila jer browser ne šalje kolačiće cross-origin
request.clone({ withCredentials: true })
```

### 10.5 Stranica za prijavu i registraciju (LoginComponent)

Ista stranica (tabovi: Prijava / Registracija):

**Tok registracije volontera:**
1. Korisnik bira ulogu "Volonter"
2. Popunjava ime, prezime, email, telefon, bio, portfolio link
3. Opciono uploaduje CV PDF (max 15 MB)
4. Dodaje minimalno 1 uslugu (naziv, cijena, kategorija)
5. Prihvata uslove korišćenja
6. Klik "Kreirajte nalog":
   - Sistem provjerava email (blur event → API call)
   - Ako je email slobodan, uploaduje CV (ako postoji)
   - Šalje registracioni zahtjev backendu
   - Backend kreira korisnika i VolonterInfo zapis
   - Prikazuje poruku da čeka verifikaciju

**Email provjera u realnom vremenu:**
- Na `blur` event email polja poziva se `GET /api/korisnici/provjeri-email?email=...`
- Ako email postoji — prikazuje se inline greška i dugme je onemogućeno

### 10.6 Volonter Dashboard (VolunteerDashboardComponent)

Panel sa 5 sekcija:

**Pregled (overview):**
- KPI kartice: broj aktivnih ponuda, realizovanih usluga, prosječna ocjena, prikupljeno €
- Pregled profila sa avatarem i statusom verifikacije
- Lista aktivnih ponuda
- Nedavne recenzije

**Moje Ponude:**
- Tabela svih ponuda sa statusom (Na čekanju / Aktivna / Popunjeno)
- Dugmad za uređivanje i brisanje
- Modal za dodavanje/uređivanje ponude
- Brisanje je blokrano ako postoje kupovine; prikazuje se jasna poruka

**Moje Prodaje:**
- Lista svih kupovina volonterovih usluga
- Status isporuke (Na čekanju / Realizovano)
- Dugme "Označi završenim" za aktivne kupovine
- Dugme "Certifikat" za realizovane kupovine (otvara printabilni certifikat)

**Recenzije:**
- Sve recenzije kupaca za usluge volontera
- Prosječna ocjena i ukupan broj
- Mogućnost odgovaranja na recenziju

**Moj Profil:**
- Uređivanje ličnih podataka
- Upload profilne slike

### 10.7 Certifikat o volontiranju

Generisanje certifikata se dešava **isključivo na frontendu** bez serverske PDF generacije:

1. Volonter klikne "Certifikat" pored realizovane usluge
2. Otvara se novi prozor sa HTML certifikatom
3. Certifikat sadrži:
   - Zaglavlje sa Dobrobit brendingom (zeleni gradijent)
   - Ime volontera (istaknuto)
   - Naziv realizovane usluge
   - Korisnik pomoći kome je usluga bila namijenjena
   - Datum realizacije
4. Dugme "Štampaj / Sačuvaj kao PDF" poziva `window.print()`
5. Korisnik koristi browser print dijalog za čuvanje kao PDF

### 10.8 Admin Dashboard (AdminComponent)

Panel sa sekcijama:

**Dashboard pregled:**
- 4 KPI kartice: ukupno volontera, na verifikaciji, aktivnih ponuda, ukupno donacija
- Lista volontera na čekanju verifikacije
- Logovi aktivnosti

**Volonteri:**
- Filtriranje po statusu
- Pretraga po imenu/emailu
- Klik na volontera → modal sa detaljima:
  - Lični podaci, email, status
  - Biografija, portfolio link, CV PDF link
  - **Lista prijavljenih ponuda** (naziv, kategorija, cijena, status)
  - Statistike (broj realizovanih usluga, datum registracije)
  - Dugmad "Odobri" i "Odbij"

**Ponude:**
- Lista svih ponuda sa filterima
- Odobravanje, odbijanje, uklanjanje ponuda

**Korisnici Pomoći:**
- Upravljanje korisnicima pomoći
- Dodavanje, uređivanje, prikaz statistika

**Recenzije:**
- Pregled svih recenzija
- Brisanje neprimjerenih

**Transakcije:**
- Pregled svih kupovina i donacija
- Filtriranje po statusu, pretraga

**Logovi:**
- Sistemski logovi aktivnosti

---

## 11. KORISNIČKE ULOGE I TOKOVI

### 11.1 Tok: Registracija i verifikacija volontera

```
Volonter popunjava formu → Upload CV (opciono)
        ↓
POST /api/korisnici/registracija
        ↓
Backend: provjera emaila, kreiranje Korisnik + VolonterInfo
statusNaloga = na_cekanju, verifikovan = false
        ↓
Email potvrde registracije → Volonter
        ↓
Admin vidi na listi "Na Čekanju"
Admin otvara profil → vidi podatke, ponude, CV
        ↓
Admin klikne "Odobri" →
PUT /api/korisnici/{id}/status { noviStatus: "aktivan" }
        ↓
statusNaloga = aktivan, verifikovan = true
Email odobrenja → Volonter
        ↓
Volonter se može prijaviti i pristupiti dashboardu
```

### 11.2 Tok: Kupovina usluge

```
Kupac pregledava usluge na /usluge
        ↓
Odabire uslugu i korisnika pomoći
Odabire iznos i način plaćanja
        ↓
POST /api/kupovine/kupi
{ kupacId, uslugaId, pomocId, nacinPlacanja, iznos }
        ↓
Backend:
- Validira kupca, uslugu (mora biti "aktivna"), korisnika pomoći
- Kreira KupljenaUsluga (statusIsporuke = "na_cekanju")
- Ako je dostignut kapacitet → usluga.statusObjave = "popunjeno"
        ↓
Volonter vidi novu prodaju u dashboardu
        ↓
Nakon realizacije usluge, volonter/kupac/admin klikne "Realizovano"
PATCH /api/kupovine/{id}/realizovano
        ↓
statusIsporuke = "realizovano", datumRealizacije = now()
volonterInfo.brojUsluga += 1
        ↓
Volonter može preuzeti certifikat
Kupac može ostaviti recenziju
```

### 11.3 Tok: Direktna donacija

```
Posjetilac (bez registracije) na /donacije ili početnoj
        ↓
Odabire korisnika pomoći i iznos
Odabire anonimnost
        ↓
POST /api/donacije
Preusmjeravanje na /placanje s query parametrima
        ↓
PaymentComponent procesira plaćanje
        ↓
Preusmjeravanje na /hvala
```

### 11.4 Tok: Recenzija

```
Usluga je realizovana (statusIsporuke = "realizovano")
        ↓
Kupac u svom dashboardu vidi dugme "Ocijeni"
        ↓
POST /api/recenzije/dodaj
{ kupovinaId, kupacId, brojZvjezdica, komentar }
        ↓
Backend provjerava:
- Kupac je zaista platio tu kupovinu
- Recenzija još ne postoji za tu kupovinu
- Ocjena je između 1 i 5
        ↓
Recenzija kreirana → vidljiva u volonter dashboardu
Utiče na prosječnu ocjenu u "Istaknuti volonteri"
```

---

## 12. POSLOVNE LOGIKE I PRAVILA

### 12.1 Pravila duplikata emaila

- Email je jedinstven na nivou baze (`UNIQUE` constraint)
- Backend provjera u servisu (`existsByEmail`) vraća grešku PRIJE upisivanja u bazu
- Frontend u realnom vremenu (na `blur`) provjerava dostupnost emaila
- Rezultat: korisnik **ne može kreirati dva naloga** sa istim emailom

### 12.2 Pravila brisanja usluge

- **Može se obrisati:** usluga bez ikakve istorije kupovina
- **Ne može se obrisati:** usluga sa aktivnim (nerealizovanim) kupovinima — poruka: "Ne možete obrisati uslugu koja ima aktivne kupovine"
- **Ne može se obrisati:** usluga sa istorijom kupovina (čak i realizovanih) — poruka: "Ne možete obrisati uslugu koja ima istoriju kupovina. Možete je deaktivirati."

### 12.3 Pravila kapaciteta usluge

- Volonter može postaviti `kapacitet` na uslugu (npr. "prihvatam max 10 zahtjeva")
- Nakon svake kupovine, sistem provjerava: `broja_kupovina >= kapacitet`
- Ako je dostignut kapacitet → `statusObjave = "popunjeno"` (automatski)

### 12.4 Pravila recenzija

- Samo kupac koji je platio određenu kupovinu može ostaviti recenziju za nju
- Jedna kupovina = jedna recenzija (ne može se dodati duplikat)
- Ocjena mora biti između 1 i 5
- Samo administrator može obrisati recenziju

### 12.5 Algoritam "Istaknuti volonteri"

```
score = avgOcjena × 2.0 + brojRealizovanihUsluga × 0.5
```

Volonteri su rangirani opadajuće po ovom score-u. Top 5 se prikazuje na početnoj stranici. Ovo znači da volonter sa visokim ocjenama ali malo usluga može biti rangiran ispred volontera sa puno usluga ali nižom ocjenom.

### 12.6 Status naloga volontera

| Status | Može se prijaviti | Admin može promijeniti |
|---|---|---|
| `na_cekanju` | NE | DA (→ aktivan ili suspendovan) |
| `aktivan` | DA | DA (→ suspendovan ili uklonjen) |
| `suspendovan` | NE | DA (→ aktivan ili uklonjen) |
| `uklonjen` | NE | NE (finalno stanje) |

### 12.7 Pravila prvog admina

- Endpoint `POST /api/korisnici/registracija/prviAdmin` radi **samo jednom** — ako već postoji administrator, vraća grešku.
- Ovo sprječava neovlašteno kreiranje admin naloga.

---

## 13. POKRETANJE PROJEKTA (kratki vodič)

### Preduslovi

- Java JDK 17 ili noviji
- Node.js 18+ i npm
- MySQL 8.x (pokrenut na portu 3306)
- Kreirana baza podataka `dobrobit1`

### Pokretanje backenda

```bash
cd sofvtersko
./mvnw spring-boot:run
# ili na Windows:
mvnw.cmd spring-boot:run
```

Backend se pokreće na `http://localhost:8080`

Hibernate automatski kreira/ažurira sve tabele pri pokretanju (`ddl-auto=update`).

### Pokretanje frontenda

```bash
cd frontend
npm install       # samo prvi put
npm start         # ili: ng serve
```

Frontend se pokreće na `http://localhost:4200`

### Redosljed pokretanja

1. MySQL mora biti pokrenut
2. Pokrenuti backend (čeka dok se baza inicijalizuje)
3. Pokrenuti frontend
4. Otvoriti `http://localhost:4200` u browseru

---

## 14. KONFIGURACIJA

### application.properties (backend)

```properties
# Baza podataka
# VAŽNO: koristimo 127.0.0.1 umjesto "localhost"
# Na Windows-u "localhost" se razrješava na IPv6 adresu (::1) dok MySQL sluša na IPv4 (127.0.0.1)
# Korišćenje "localhost" uzrokuje 1–3 sekunde kašnjenja na svakom zahtjevu
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/dobrobit1?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=<lozinka>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate / JPA
spring.jpa.hibernate.ddl-auto=update   # Automatsko kreiranje/ažuriranje tabela
spring.jpa.show-sql=false              # NE ispisuj SQL u konzolu (povećava performanse)
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server
server.port=8080

# Multipart upload (CV fajlovi)
spring.servlet.multipart.max-file-size=15MB
spring.servlet.multipart.max-request-size=16MB

# Email (Outlook SMTP)
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=dobrobit2026@outlook.com
spring.mail.password=<lozinka>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
# Kratki timeoutti — email se šalje async pa ne blokira HTTP odgovor
spring.mail.properties.mail.smtp.connectiontimeout=3000
spring.mail.properties.mail.smtp.timeout=3000
spring.mail.properties.mail.smtp.writetimeout=3000
spring.mail.test-connection=false
```

### Angular proxy konfiguracija (proxy.conf.json)

Angular dev server proksira `/api/*` zahtjeve direktno na backend:

```json
{
  "/api": {
    "target": "http://127.0.0.1:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

> **Napomena:** Proxy koristi `127.0.0.1` iz istog razloga kao i backend — da izbjegne IPv6/IPv4 mismatch na Windows-u.

### Folder za uploadove

CV fajlovi se čuvaju na lokaciji koja zavisi od operativnog sistema:
```
Windows: C:\Users\<korisnik>\dobrobit-uploads\cv\
Linux/Mac: /home/<korisnik>/dobrobit-uploads/cv/
```

---

## NAPOMENE ZA BUDUĆE RAZVOJ

- Sistem trenutno ne implementira stvarno procesiranje kartica — plaćanje je simulirano
- Google prijava dugme postoji u UI ali nije implementirano
- "Zaboravili ste lozinku" link nije implementiran
- Profilna slika volontera se ne uploaduje na server (putanja se unosi ručno)
- Odgovori volontera na recenzije se čuvaju samo lokalno u memoriji (ne persistuju se u bazu)
- Admin notifikacioni sistem (upozorenja) je vizuelno implementiran ali bez backend logike

---

---

## 15. POSTAVLJANJE NA NOVOM RAČUNARU

> Ova sekcija je namijenjena koleginicama koje kloniraju repozitorijum i žele pokrenuti cijeli projekat lokalno od nule.

### 15.1 Preduslovi — šta treba instalirati

#### Java JDK 17+

Provjeri da li je instaliran:
```bash
java -version
```
Ako nije, preuzmi sa: https://adoptium.net (odaberi **Temurin JDK 17** ili noviji)

#### MySQL 8.x

Provjeri da li je instaliran i aktivan:
```bash
mysql --version
```
Ako nije, preuzmi **MySQL Community Server 8.x** sa: https://dev.mysql.com/downloads/mysql/

#### Node.js 18+ i npm

```bash
node --version   # mora biti 18.x ili noviji
npm --version    # dolazi uz Node.js
```
Ako nije instaliran: https://nodejs.org (odaberi **LTS** verziju)

#### Angular CLI (globalno)

```bash
npm install -g @angular/cli
ng version   # provjera
```

---

### 15.2 Kloniranje repozitorijuma

```bash
git clone git@gitlab.com:anciNPT/sofvtersko.git
cd sofvtersko
```

Repozitorijum sadrži tri komponente:
```
sofvtersko/    ← Spring Boot backend
frontend/      ← Angular web aplikacija
mobile/        ← Ionic Angular mobilna aplikacija
```

---

### 15.3 Postavljanje MySQL baze podataka

#### Korak 1 — Pokrenuti MySQL server

**Windows:** Otvori "Services" (Win+R → `services.msc`) i pokreni **MySQL80** servis, ili iz MySQL Workbencha.

**Alternativno putem komandne linije:**
```bash
# Windows (ako je MySQL u PATH-u)
net start mysql80
```

#### Korak 2 — Kreirati bazu podataka

Povežite se na MySQL (putem MySQL Workbencha ili komandne linije):

```sql
-- Kreirati bazu
CREATE DATABASE dobrobit1
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Provjera
SHOW DATABASES;
-- trebalo bi da se vidi "dobrobit1" na listi
```

> **Važno:** Ime baze mora biti tačno `dobrobit1` jer je to upisano u konfiguracionom fajlu backenda.

#### Korak 3 — Kreirati MySQL korisnika (opciono, preporučeno)

Možete koristiti `root` korisnika (jednostavnije za razvoj) ili kreirati posebnog korisnika:

```sql
-- Kreiranje korisnika (opciono)
CREATE USER 'dobrobit_user'@'localhost' IDENTIFIED BY 'odaberi_jaku_lozinku';
GRANT ALL PRIVILEGES ON dobrobit1.* TO 'dobrobit_user'@'localhost';
FLUSH PRIVILEGES;
```

> Tabele **ne treba ručno kreirati** — Hibernate (`ddl-auto=update`) ih automatski kreira pri prvom pokretanju backenda.

---

### 15.4 Konfiguracija backenda (application.properties)

**Lokacija fajla:**
```
sofvtersko/src/main/resources/application.properties
```

Otvorite ovaj fajl u editoru i prilagodite vrijednosti svom računaru:

```properties
# ─── Baza podataka ──────────────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/dobrobit1?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=VASA_MYSQL_LOZINKA
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ─── Hibernate / JPA ────────────────────────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# ─── Server ─────────────────────────────────────────────────────
server.port=8080

# ─── Multipart upload (za CV fajlove volontera) ─────────────────
spring.servlet.multipart.max-file-size=15MB
spring.servlet.multipart.max-request-size=16MB

# ─── Email (Outlook SMTP) ───────────────────────────────────────
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=VASA_EMAIL_ADRESA@outlook.com
spring.mail.password=VASA_EMAIL_LOZINKA
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.test-connection=false
```

**Šta treba promijeniti:**

| Polje | Šta upisati |
|-------|-------------|
| `spring.datasource.password` | Lozinka vašeg MySQL `root` korisnika (ili korisnika kojeg ste kreirali) |
| `spring.mail.username` | Email adresa s koje će ići notifikacije (Outlook nalog) |
| `spring.mail.password` | Lozinka tog email naloga |

> **Napomena o emailu:** Email notifikacije nisu obavezne za testiranje. Ako ne želite podešavati email, možete privremeno dodati `spring.mail.test-connection=false` i ignorisati email greške — aplikacija će funkcionisati normalno, samo notifikacije neće stizati.

---

### 15.5 Pokretanje backenda

```bash
cd sofvtersko

# Windows
mvnw.cmd spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```

**Šta se dešava pri prvom pokretanju:**
1. Maven preuzima sve Java zavisnosti (~2–5 minuta pri prvom pokretanju)
2. Spring Boot se konektuje na MySQL
3. Hibernate skenira sve `@Entity` klase i **automatski kreira tabele** u `dobrobit1` bazi
4. Aplikacija je dostupna na `http://localhost:8080`

**Provjera da li radi:**
```bash
curl http://localhost:8080/api/kategorije
# Treba vratiti prazan niz [] ili listu kategorija ako postoje
```

Ili u pretraživaču otvorite: `http://localhost:8080/api/kategorije`

**Tipične greške pri pokretanju:**

| Greška | Uzrok | Rješenje |
|--------|-------|----------|
| `Communications link failure` | MySQL nije pokrenut | Pokrenite MySQL servis |
| `Access denied for user 'root'@'localhost'` | Pogrešna lozinka u `application.properties` | Ispravite `spring.datasource.password` |
| `Unknown database 'dobrobit1'` | Baza nije kreirana | Pokrenite `CREATE DATABASE dobrobit1` |
| `Port 8080 already in use` | Nešto već sluša na 8080 | Ugasite tu aplikaciju ili promijenite `server.port` |
| `java: command not found` | JDK nije instaliran | Instalirajte JDK 17+ |

---

### 15.6 Inicijalni podaci u bazi

Hibernate kreira prazne tabele. Za testiranje su potrebni minimalni podaci.

#### Kreiranje prvog administratora

Endpoint za prvog admina radi **samo jednom** (ako već postoji administrator, vraća grešku):

```bash
curl -X POST http://localhost:8080/api/korisnici/registracija/prviAdmin \
  -H "Content-Type: application/json" \
  -d '{
    "ime": "Admin",
    "prezime": "Dobrobit",
    "email": "admin@dobrobit.com",
    "lozinkaHash": "admin123",
    "tipKorisnika": "administrator"
  }'
```

Ili putem MySQL Workbencha (ako ne koristite curl) direktno insertujte admina:

```sql
-- Lozinka "admin123" enkodovana BCryptom
-- NAPOMENA: svaki put kada pravite admina, promijenite lozinku i koristite novi BCrypt hash
-- BCrypt hash za "admin123" (10 rundi):
INSERT INTO korisnik (ime, prezime, email, lozinka_hash, tip_korisnika, status_naloga, verifikovan, prikaz_anonimno, datum_registracije)
VALUES ('Admin', 'Dobrobit', 'admin@dobrobit.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhmW',
        'administrator', 'aktivan', true, false, NOW());
```

#### Dodavanje kategorija

Kategorije su potrebne za usluge. Dodajte ih putem endpointa ili SQL:

```sql
INSERT INTO kategorija (naziv, opis) VALUES
  ('IT i Tehnologija', 'Softverska podrška, web razvoj, IT savjetovanje'),
  ('Obrazovanje', 'Privatne lekcije, tutorstvo, radionice'),
  ('Pravne usluge', 'Pravno savjetovanje, ugovori, zastupanje'),
  ('Finansije', 'Računovodstvo, poresko savjetovanje'),
  ('Ljepota i njega', 'Frizerstvo, kozmetika, masaža'),
  ('Muzika i umjetnost', 'Muzičke lekcije, fotografija, dizajn'),
  ('Sport i fitness', 'Personalni trening, joga, plivanje'),
  ('Psihološka podrška', 'Savjetovanje, terapija, mentalno zdravlje'),
  ('Ostalo', 'Ostale usluge koje ne spadaju u gornje kategorije');
```

#### Dodavanje korisnika pomoći (za testiranje donacija)

```sql
INSERT INTO korisnik_pomoci (naziv, opis_potrebe, broj_racuna) VALUES
  ('Porodica Jovanović', 'Troče porodice, potrebna finansijska podrška', '123-456-789'),
  ('Udruženje slijepih', 'Podrška osobama s oštećenjem vida', '987-654-321');
```

---

### 15.7 Pokretanje web frontenda

```bash
cd frontend
npm install    # samo prvi put — preuzima Angular pakete
npm start      # pokreće ng serve na portu 4200
```

Aplikacija je dostupna na `http://localhost:4200`

---

### 15.8 Pokretanje mobilne aplikacije

```bash
cd mobile
npm install           # samo prvi put
npm start -- --port 4300
```

Aplikacija je dostupna na `http://localhost:4300`

> **Zašto port 4300?** CORS konfiguracija u `SecurityConfig.java` dozvoljava origin `localhost:4300`. Ako pokrenete na drugom portu, pretraživač će blokirati sve API pozive prema backendu.

---

### 15.9 Kompletna tabela portova

| Komponenta | Port | URL | Komanda za pokretanje |
|------------|------|-----|-----------------------|
| MySQL | 3306 | — | (servis u pozadini) |
| Spring Boot backend | 8080 | `http://localhost:8080` | `mvnw.cmd spring-boot:run` |
| Web frontend (Angular) | 4200 | `http://localhost:4200` | `npm start` |
| Mobilna aplikacija (Ionic) | 4300 | `http://localhost:4300` | `npm start -- --port 4300` |

---

### 15.10 Folder za upload fajlova (CV volontera)

Backend čuva uploadovane CV PDF fajlove na lokalnom disku. Folder se **automatski kreira** pri prvom uploadu, ali možete ga kreirati ručno:

**Windows:**
```
C:\Users\<vaše_korisničko_ime>\dobrobit-uploads\cv\
```

**Linux/Mac:**
```
/home/<vaše_korisničko_ime>/dobrobit-uploads/cv/
```

Putanja je hardkodirana u `FileUploadController.java`. Ako je potrebno promijeniti lokaciju, uredite:
```java
private static final String UPLOAD_DIR = 
    System.getProperty("user.home") + "/dobrobit-uploads/cv/";
```

---

### 15.11 Preporučeni redosljed za prvu sesiju testiranja

```
1.  Pokrenite MySQL servis
2.  Kreirajte bazu: CREATE DATABASE dobrobit1
3.  Podesite application.properties (MySQL lozinka)
4.  Pokrenite backend: cd sofvtersko && mvnw.cmd spring-boot:run
5.  Sačekajte dok se ne pojavi "Started DobrobitApplication" u konzoli
6.  Kreirajte admina: POST /api/korisnici/registracija/prviAdmin
7.  Dodajte kategorije u bazu (SQL ili putem API-ja s admin nalogom)
8.  Registrujte test volontera (putem web frontenda ili mobilne aplikacije)
9.  Prijavite se kao admin → odobrite volontera
10. Registrujte test kupca
11. Kupac kupuje uslugu → volonter označava kao realizovano → kupac ostavlja recenziju
```

---

### 15.12 Testiranje API-ja bez frontenda (Postman / curl)

Možete direktno testirati backend bez pokretanja Angular aplikacija:

**Primjer: Prijava kao admin**
```bash
curl -X POST http://localhost:8080/api/korisnici/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "admin@dobrobit.com", "lozinka": "admin123"}'
```

Fajl `cookies.txt` čuva session cookie za naredne zahtjeve:

```bash
# Dohvati sve korisnike (zahtijeva admin sesiju)
curl http://localhost:8080/api/korisnici/ \
  -b cookies.txt

# Dohvati sve kategorije (javno)
curl http://localhost:8080/api/kategorije
```

---

---

## 16. DUGME PRISTUPAČNOSTI — DETALJNA DOKUMENTACIJA

Na svakoj stranici platforme, u gornjem lijevom uglu, nalazi se dugme sa ikonom oka (`👁`). Ovo je **panel pristupačnosti** koji omogućava korisnicima da prilagode izgled i ponašanje stranice prema sopstvenim potrebama — bez ikakvih posebnih podešavanja browsera ili operativnog sistema.

### 16.1 Gdje se čuva stanje

Sva korisnička podešavanja pristupačnosti čuvaju se u `localStorage` browsera pod ključem:

```
dobrobit_a11y_v2
```

Ovo znači:
- Podešavanja **ostaju nakon zatvaranja taba** i ponovnog otvaranja stranice
- Podešavanja se primjenjuju **odmah pri učitavanju** svake stranice (bez treptaja)
- Podešavanja su **lokalna po uređaju i browseru** — ne sinhronizuju se između uređaja
- Klik na "Resetuj sve" briše ovaj ključ iz `localStorage` i uklanja sve promjene

### 16.2 Kako se podešavanja primjenjuju

`AccessibilityService` (fajl: `frontend/src/app/core/services/accessibility.service.ts`) inicializuje se pri pokretanju Angular aplikacije. U konstruktoru poziva `load()` koji:

1. Čita JSON objekat iz `localStorage`
2. Za svaku sačuvanu opciju — dodaje odgovarajući CSS class na `document.body` ili postavljanjem inline stila na `document.documentElement` (`:root`)

Sve vizuelne promjene su implementirane isključivo kroz CSS — Angular ne mijenja nikakav sadržaj stranice, samo dodaje/uklanja klase na `<body>` tagu.

### 16.3 Dostupne opcije — detaljan opis

#### 1. Veličina teksta
**CSS klase:** `a11y-font-small` / `a11y-font-large` / `a11y-font-xlarge`

Primjenjuje se na `document.body`. Četiri nivoa:
- Podrazumijevan (bez klase) — standardna veličina fonta
- Mali — nešto manji tekst
- Veliki — tekst povećan za ~25%
- Jako veliki — tekst povećan za ~50%

Sve veličine teksta su definisane u globalnom CSS-u koristeći `font-size` na elementu `body`, čime se automatski skaliraju svi elementi koji koriste relativne jedinice (`rem`, `em`).

#### 2. Font za disleksiju (OpenDyslexic)
**CSS klasa:** `a11y-dyslexia`

Učitava OpenDyslexic font sa CDN-a i primjenjuje ga na cijelu stranicu. OpenDyslexic je specijalno dizajniran font koji pomaže osobama s disleksijom tako što otežava "okretanje" slova — svako slovo ima drugačiji vizuelni težinski centar.

Font se učitava dinamički (ubacuje se `<link>` tag u `<head>`) samo kad je opcija uključena, čime se izbjegava nepotrebno preuzimanje za korisnike koji ga ne trebaju.

#### 3. Visoki kontrast
**CSS klasa:** `a11y-high-contrast`

Pojačava kontrast između pozadine i teksta. Tekst postaje crn na bijeloj pozadini (ili bijel na tamnoj), sve dekorativne boje se neutrališu, a ivice elemenata postaju jasnije. Namijenjeno korisnicima sa slabijim vidom.

#### 4. Tamni način rada (Dark Mode)
**CSS klasa:** `a11y-dark`

Prebacuje cijelu stranicu na tamnu paletu boja. Pozadina postaje tamna (siva ili crna), tekst postaje svijetao. Korisno u tamnim okruženjima ili za osobe kojima tamni ekrani manje naprezaju oči.

#### 5. Način za slabovidnost — boje

Tri posebna filtera za različite tipove poremećaja percepcije boja:

| Opcija | CSS klasa | Opis |
|---|---|---|
| Protanopija | `a11y-protanopia` | Teškoća s crvenom bojom (najčešći tip) |
| Deuteranopija | `a11y-deuteranopia` | Teškoća sa zelenom bojom |
| Tritanopija | `a11y-tritanopia` | Teškoća s plavom bojom |

Implementirano kroz SVG `<filter>` s matricama transformacije boja (`feColorMatrix`). Filter se ubacuje dinamički u DOM i primjenjuje na cijelu stranicu koristeći CSS `filter: url(#...)`.

#### 6. Smanji animacije (Reduce Motion)
**CSS klasa:** `a11y-reduce-motion`

Isključuje ili drastično usporava sve CSS animacije i tranzicije na stranici. Namijenjeno osobama s vestibularnim poremećajima ili epilepsijom kojima kretanje na ekranu može izazvati nelagodu ili napad. Implementirano kroz:
```css
.a11y-reduce-motion * {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

#### 7. Povećan razmak između linija (Line Spacing)
**CSS klasa:** `a11y-line-spacing`

Povećava `line-height` na cijeloj stranici (npr. sa 1.5 na 2.0). Pomaže osobama s disleksijom i slabijim vidom da lakše prate redove teksta.

#### 8. Povećan razmak između slova (Letter Spacing)
**CSS klasa:** `a11y-letter-spacing`

Dodaje `letter-spacing` na sve tekstualne elemente. Razmaknutija slova olakšavaju čitanje osobama s disleksijom.

#### 9. Isticanje fokusa (Focus Highlight)
**CSS klasa:** `a11y-focus-highlight`

Dodaje vidljiv okvir oko svakog elementa koji je trenutno u fokusu tastature (dugmad, linkovi, polja za unos). Neophodan za korisnike koji navigiraju tasterom `Tab` umjesto mišem. CSS:
```css
.a11y-focus-highlight *:focus {
  outline: 3px solid #f59e0b !important;
  outline-offset: 2px !important;
}
```

#### 10. Veliki kursor
**CSS klasa:** `a11y-large-cursor`

Uvećava kursor miša koristeći SVG kursor definisan u CSS-u. Korisno za osobe s motoričkim teškoćama ili slabijim vidom.

#### 11. Audio podrška (placeholder)
Dugme je vizuelno prisutno u panelu ali funkcionalnost nije implementirana — čeka integraciju sa screen readerom ili audio opisima slika.

### 16.4 Resetovanje svih podešavanja

Dugme "Resetuj sve" u panelu poziva `resetAll()` metod u `AccessibilityService`:

```typescript
resetAll() {
  // Uklanja sve a11y CSS klase sa <body>
  document.body.classList.remove(
    'a11y-font-small', 'a11y-font-large', 'a11y-font-xlarge',
    'a11y-dyslexia', 'a11y-high-contrast', 'a11y-dark',
    'a11y-protanopia', 'a11y-deuteranopia', 'a11y-tritanopia',
    'a11y-reduce-motion', 'a11y-line-spacing', 'a11y-letter-spacing',
    'a11y-focus-highlight', 'a11y-large-cursor'
  );
  // Briše podešavanja iz localStorage
  localStorage.removeItem('dobrobit_a11y_v2');
}
```

---

*Dokumentacija generisana: Jun 2026*  
*Projekat: Dobrobit humanitarna platforma*  
*Tim: Isidora Mujović, Slavica Drobnjak, Anastasija Bulatović*
