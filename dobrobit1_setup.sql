-- =============================================================
--  DOBROBIT — Skripta za postavljanje baze podataka
--  Verzija: 2026-06-19
-- =============================================================
--
--  UPUTSTVO ZA POSTAVLJANJE:
--  -------------------------------------------------
--  1. Instalirajte MySQL 8.0 (https://dev.mysql.com/downloads/)
--
--  2. Otvorite MySQL Workbench ili komandnu liniju i pokrenite:
--
--     mysql -u root -p < dobrobit1_setup.sql
--
--     ILI u MySQL Workbench:
--     File > Open SQL Script > dobrobit1_setup.sql > Execute (munja)
--
--  3. U fajlu sofvtersko/src/main/resources/application.properties
--     postavite svoje MySQL kredencijale:
--
--       spring.datasource.username=root
--       spring.datasource.password=VASA_LOZINKA
--
--  4. Pokrenite backend:
--       cd sofvtersko
--       ./mvnw spring-boot:run          (Mac/Linux)
--       .\mvnw.cmd spring-boot:run      (Windows)
--
--  5. Pokrenite frontend:
--       cd frontend
--       npm install
--       npm start
--
--  ADMIN PRISTUP:
--  -------------------------------------------------
--  Email:   admin@dobrobit.me
--  Lozinka: Admin123!
--
--  TESTNI KORISNICI:
--  -------------------------------------------------
--  Kupac:     kupac_t1@test.com    / Test123!
--  Volonter:  jelena.radovic@test.com / (BCrypt hash, reset ako treba)
--
-- =============================================================

CREATE DATABASE IF NOT EXISTS `dobrobit1`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `dobrobit1`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: dobrobit1
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `donacija`
--

DROP TABLE IF EXISTS `donacija`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donacija` (
  `donacija_id` int NOT NULL AUTO_INCREMENT,
  `donator_id` int NOT NULL,
  `pomoc_id` int NOT NULL,
  `iznos` decimal(38,2) NOT NULL,
  `status_donacije` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_placanja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacin_placanja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenca_placanja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datum_donacije` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `anonimno` bit(1) NOT NULL,
  PRIMARY KEY (`donacija_id`),
  KEY `idx_donacija_donator` (`donator_id`),
  KEY `idx_donacija_pomoc` (`pomoc_id`),
  CONSTRAINT `fk_donacija_donator` FOREIGN KEY (`donator_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_donacija_pomoc` FOREIGN KEY (`pomoc_id`) REFERENCES `korisnik_pomoci` (`pomoc_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donacija`
--

LOCK TABLES `donacija` WRITE;
/*!40000 ALTER TABLE `donacija` DISABLE KEYS */;
INSERT INTO `donacija` VALUES (20,65,6,150.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0'),(21,65,7,85.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0'),(22,65,8,200.00,'PLACENO',NULL,'PAYPAL',NULL,'2026-06-08 18:09:44',_binary '\0'),(23,69,6,50.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0'),(24,69,7,120.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0'),(25,65,6,75.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0'),(26,69,8,90.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0'),(27,65,7,200.00,'PLACENO',NULL,'KARTICA',NULL,'2026-06-08 18:09:44',_binary '\0');
/*!40000 ALTER TABLE `donacija` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategorija`
--

DROP TABLE IF EXISTS `kategorija`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategorija` (
  `kategorija_id` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opis` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`kategorija_id`),
  UNIQUE KEY `naziv` (`naziv`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategorija`
--

LOCK TABLES `kategorija` WRITE;
/*!40000 ALTER TABLE `kategorija` DISABLE KEYS */;
INSERT INTO `kategorija` VALUES (1,'IT i Tehnologija','Programiranje, IT podrška, web razvoj, dizajn'),(2,'Obrazovanje','Podučavanje, prevođenje, pisanje, tutorstvo'),(3,'Zdravlje i Njega','Psihološka podrška, fitnes, njega starijih'),(4,'Kućni Majstor','Popravke, montaža, vodoinstalacije, elektrika'),(5,'Prevoz i Dostava','Prijevoz osoba i stvari, dostava'),(6,'Hrana i Kulinarski','Domaće namirnice, kuhanje, pečenje'),(7,'Kreativnost i Dizajn','Grafički dizajn, fotografija, video, muzika'),(8,'Biznis i Savjetovanje','Konsalting, računovodstvo, pravni savjeti'),(9,'Sport i Rekreacija','Personalni trening, sportska oprema, aktivnosti'),(10,'Ostalo','Sve što ne spada u gore navedene kategorije'),(11,'Test Kategorija','Opis test kategorije'),(12,'Proizvodi',''),(13,'Astrologija','');
/*!40000 ALTER TABLE `kategorija` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `korisnik`
--

DROP TABLE IF EXISTS `korisnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `korisnik` (
  `korisnik_id` int NOT NULL AUTO_INCREMENT,
  `ime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prezime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lozinka_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tip_korisnika` enum('donator','volonter','korisnik_pomoci','administrator','kupac') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_naloga` enum('aktivan','na_cekanju','suspendovan','neaktivan','uklonjen') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'na_cekanju',
  `datum_registracije` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verifikovan` tinyint(1) NOT NULL DEFAULT '0',
  `naziv` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prikaz_anonimno` bit(1) NOT NULL,
  `razlog_promjene_statusa` text COLLATE utf8mb4_unicode_ci,
  `opis` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`korisnik_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_korisnik_tip` (`tip_korisnika`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `korisnik`
--

LOCK TABLES `korisnik` WRITE;
/*!40000 ALTER TABLE `korisnik` DISABLE KEYS */;
INSERT INTO `korisnik` VALUES (1,'Ana','Anić','ana@test.com','$2a$10$yYj.aL956qoZZBR6vpXHAu2gTZMVXVq9Ym5m5eOH/uKoNffBdWn3a',NULL,NULL,'donator','na_cekanju','2026-04-26 20:01:14',0,NULL,_binary '\0',NULL,NULL),(2,'Ana','Maric','anaa@test.com','$2a$10$iUqdqeekPgXnDZdbY5eiMeFpvfR5vKRlgDHlZyh9jp3LOm5PIIgzq',NULL,NULL,'donator','na_cekanju','2026-04-26 20:24:48',0,NULL,_binary '\0',NULL,NULL),(7,'Marko','Vešović','marko@test.com','$2a$10$8K1p/a0dR1xqM4BKprd5puVHEhxSPQT5HlKlUKFOPvPKwFxGxLpri',NULL,NULL,'volonter','uklonjen','2026-06-03 17:45:10',0,NULL,_binary '\0','Uklonjen od strane administratora','Online predavac – matematika, IT, programiranje'),(8,'Srđan','Kadić','srdjan@test.com','$2a$10$8K1p/a0dR1xqM4BKprd5puVHEhxSPQT5HlKlUKFOPvPKwFxGxLpri',NULL,NULL,'kupac','aktivan','2026-06-03 17:45:10',1,NULL,_binary '\0',NULL,NULL),(10,'Marko','Jovanović','marko123@test.com','$2a$10$ySXDeH7rn.DECZWD/.jRfukW.MVM.h0kbUKFONg6pQo23CgF93mDq','','','volonter','uklonjen','2026-06-03 17:45:28',0,NULL,_binary '\0','Uklonjen od strane administratora','IT stručnjak'),(12,'Admin','Dobrobit','admin@dobrobit.me','$2b$10$eVg7uKQ1c8FUMs3eLDLWr.mZ/0inXNOfcD3Lhd.cfQKJ0XUKAb8rO',NULL,NULL,'administrator','aktivan','2026-06-03 18:08:13',1,NULL,_binary '\0',NULL,NULL),(57,'Admin','Dobrobit','admin2@dobrobit.me','$2a$10$gmRjg.u.RP8VrwZBSzCrOOuAA7iinpIsVDsftOkNFLsivqiqUNveS',NULL,NULL,'administrator','aktivan','2026-06-03 18:33:28',1,NULL,_binary '\0',NULL,NULL),(65,'Test','Kupac','kupac_t1@test.com','$2a$10$JlHLKe6yQySlHGkZjDKPFuHITlyNworqaFH1lpbPbbZHH906Zz5Tm',NULL,NULL,'kupac','aktivan','2026-06-08 11:57:57',1,NULL,_binary '\0',NULL,NULL),(66,'Test','Volonter','volonter_t1@test.com','$2a$10$WLJA9s7.y900xmXO1WeHI.mfiGynj606sFiK1AKXeWsFT5/COgcCa',NULL,NULL,'volonter','uklonjen','2026-06-08 11:57:59',0,NULL,_binary '\0','Uklonjen od strane administratora','Iskusan volonter'),(67,'Test','Admin','admin_t1@test.com','$2a$10$HHzYQlhEy/jlLt/G3aXjjeme2vQBwluyZYX1lrIoxR1mGlSoqBKwa',NULL,NULL,'administrator','aktivan','2026-06-08 11:58:00',1,NULL,_binary '\0',NULL,NULL),(68,'Test','User','testuser99@test.com','$2a$10$vr5hf7RkoDmhcXbXETvhGOirEBRKX7ULVFcYn6ONCWkPpY9SAY3lq',NULL,NULL,'kupac','aktivan','2026-06-08 15:41:30',1,NULL,_binary '\0',NULL,NULL),(69,'Test','Kupac','test.kupac@test.com','$2a$10$TQQUcV5ANHuGs2hKnK6NmefUfRoS7UsrDSMTDaXiWjtEWXqL6/Upa','061111111','Sarajevo','kupac','aktivan','2026-06-08 15:52:20',1,NULL,_binary '\0',NULL,NULL),(70,'Anci','Priganci','anastasijasoftversko@gmail.com','$2a$10$fYbmJynCFKNKBUxDfKwevOAcgNixdpis1emk8BoUPGgXM4rJi.HJe','+38268890890',NULL,'kupac','aktivan','2026-06-08 15:57:33',1,NULL,_binary '\0',NULL,NULL),(71,'Jelena','Radović','jelena.radovic@test.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'volonter','aktivan','2026-06-08 18:07:30',1,NULL,_binary '\0',NULL,'Prevodioc i copywriter – engleski, njemacki, pisanje clanaka'),(72,'Nikola','Popović','nikola.popovic@test.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'volonter','aktivan','2026-06-08 18:07:30',1,NULL,_binary '\0',NULL,'IT strucnjak – popravke racunara, montaza mreza'),(73,'Evica','Bulatović','evica.bulatovic@test.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'volonter','aktivan','2026-06-08 18:07:30',1,NULL,_binary '\0',NULL,'Life-coach – motivacija, licni razvoj i savjeti'),(74,'Ratka','Laban','ratka.laban@test.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'volonter','aktivan','2026-06-08 18:07:30',1,NULL,_binary '\0',NULL,'Astrolog – horoskop, savjeti, numerologija'),(75,'Petar','Stojanović','petar.stojanovic@slucaj.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'korisnik_pomoci','aktivan','2026-06-08 18:09:10',1,NULL,_binary '\0',NULL,NULL),(76,'Marija','Nikolić','marija.nikolic@slucaj.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'korisnik_pomoci','aktivan','2026-06-08 18:09:10',1,NULL,_binary '\0',NULL,NULL),(77,'Maja','Luković','maja.lukovic@slucaj.com','$2b$10$xr8.FQ.vsCPF/vvgsbKuwOqURfJWYx1xm6viUNSCLRQD.v7OFPES6',NULL,NULL,'korisnik_pomoci','aktivan','2026-06-08 18:09:10',1,NULL,_binary '\0',NULL,NULL),(78,'Slavica','Drobnjak','dobrobit2026@outlook.com','$2a$10$rO8Q6x3uqLX/YzdU2rVuhOnsUA4WzTy1L7IiKRVneTZ7ceDq.B2Nq','',NULL,'volonter','uklonjen','2026-06-08 16:35:22',0,NULL,_binary '\0','Uklonjen od strane administratora','Ja sam student pmf-a,treca godina.Osjetila sam potrebu da doprinesem svojim znanjem i vjestinama.'),(79,'Kosta','Pavlovic','kosta@ime.me','$2a$10$ykzkhJa1sllp7yRhhY3M0uqIxY7GB7vrtBmy/7BdZrBSXNanyYxa6','',NULL,'volonter','uklonjen','2026-06-08 21:12:36',0,NULL,_binary '\0','Uklonjen od strane administratora',''),(80,'Anastasija','Bulatvoci','anci@ime.me','$2a$10$VNi12RsiU6E0nDdlY3APCu9gUrfdIlu9PKzeCcdsCI3ZkSKoAOrdq','',NULL,'kupac','aktivan','2026-06-08 21:26:28',1,NULL,_binary '\0',NULL,NULL),(81,'Test','Buyer','testbuyer99@test.com','$2a$10$U/fa4ftxPkKxJkORg4mAh.FZ.Yf1Rwydv5lj78InPbVAuct5lfUuO','',NULL,'kupac','aktivan','2026-06-08 21:29:54',1,NULL,_binary '\0',NULL,NULL),(82,'Milena','Vidic','milena@gmail.com','$2a$10$ogeneiNMjio.nvD9YsWnfuwk4rQBkjZJDKtL.DM8VtjPU0K3B6o9y','',NULL,'kupac','aktivan','2026-06-08 21:41:26',1,NULL,_binary '\0',NULL,NULL),(83,'Anastasija','Bulatovic','anci@gmail.com','$2a$10$mlT5RIM0VAi/IGKeWYwbUeAgx0PhWo3BO5fLWrQVovQ45Dm3QLRFW','',NULL,'volonter','aktivan','2026-06-10 16:01:50',1,NULL,_binary '\0','Profil odobren.',''),(84,'Aleksandar','Plamenac','aleksandar@ucg.ac.me','$2a$10$gX9WeIZ/bpfYpC1Jh8XVmOnztN57FKMf7mHzr5p8gLKXukQmthMe.','anci@gmail.com',NULL,'volonter','na_cekanju','2026-06-10 16:30:19',0,NULL,_binary '\0',NULL,''),(85,'Sanja','Milosevic','sanja@gmail.com','$2a$10$tFvc7B.3PF1lW5/qpP0A7.7bkgnUPEU2C9uBPmZJCfIBMoYq/5uS6','',NULL,'kupac','aktivan','2026-06-10 16:49:42',1,NULL,_binary '\0',NULL,NULL),(86,'Isidora','Mujovic','isimujovic@gmail.com','$2a$10$MeFQ1U24uUEoXTEtxypm7uIHXu/pSzmlHVMrCK5Yz.5Ew9yRQPbLG','','','kupac','aktivan','2026-06-10 19:04:08',1,NULL,_binary '\0',NULL,NULL),(87,'Anci','Priganci','ancipriganci@gmail.com','$2a$10$O1Sz8nfW7HNBiCdMfk6gsO8njbpr3DlPJBJ2yaYo2yf/rJYAlFmFq','','','kupac','aktivan','2026-06-19 08:42:41',1,NULL,_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `korisnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `korisnik_pomoci`
--

DROP TABLE IF EXISTS `korisnik_pomoci`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `korisnik_pomoci` (
  `pomoc_id` int NOT NULL AUTO_INCREMENT,
  `korisnik_id` int DEFAULT NULL,
  `naziv_organizacije_ili_lica` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opis_potrebe` text COLLATE utf8mb4_unicode_ci,
  `broj_racuna` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dokaz_verifikacije` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_slucaja` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`pomoc_id`),
  UNIQUE KEY `korisnik_id` (`korisnik_id`),
  CONSTRAINT `fk_pomoc_korisnik` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `korisnik_pomoci`
--

LOCK TABLES `korisnik_pomoci` WRITE;
/*!40000 ALTER TABLE `korisnik_pomoci` DISABLE KEYS */;
INSERT INTO `korisnik_pomoci` VALUES (2,2,'Ana Anić','Pomoć za školovanje',NULL,NULL,'neaktivan'),(6,75,'Petar Stojanović','Ogromni troškovi terapije – bolest zahtijeva skupo liječenje. Petar boluje od teške bolesti i svaka pomoć je dragocjena za njegovu porodicu.','BA39-1010101-0101010',NULL,'aktivan'),(7,76,'Marija Nikolić','Samohrana majka troje djece – potrebna hitna pomoć za hranu, školovanje i osnovne životne troškove.','BA39-2020202-0202020',NULL,'aktivan'),(8,77,'Maja Luković','Potrebna hitna operacija srca – troškovi operacije daleko prevazilaze finansijske mogućnosti porodice Luković.','BA39-3030303-0303030',NULL,'aktivan'),(10,NULL,'Mara Maric','',NULL,NULL,'aktivan'),(13,NULL,'Vitomir Nikolic','','',NULL,'aktivan');
/*!40000 ALTER TABLE `korisnik_pomoci` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kupljena_usluga`
--

DROP TABLE IF EXISTS `kupljena_usluga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kupljena_usluga` (
  `kupovina_id` int NOT NULL AUTO_INCREMENT,
  `donator_id` int NOT NULL,
  `usluga_proizvod_id` int NOT NULL,
  `pomoc_id` int NOT NULL,
  `iznos` decimal(38,2) DEFAULT NULL,
  `datum_kupovine` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_placanja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacin_placanja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenca_placanja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datum_realizacije` datetime(6) DEFAULT NULL,
  `status_isporuke` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'na_cekanju',
  PRIMARY KEY (`kupovina_id`),
  KEY `idx_kupovina_donator` (`donator_id`),
  KEY `idx_kupovina_pomoc` (`pomoc_id`),
  KEY `idx_kupovina_usluga` (`usluga_proizvod_id`),
  CONSTRAINT `fk_kupovina_donator` FOREIGN KEY (`donator_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_kupovina_pomoc` FOREIGN KEY (`pomoc_id`) REFERENCES `korisnik_pomoci` (`pomoc_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_kupovina_usluga` FOREIGN KEY (`usluga_proizvod_id`) REFERENCES `usluga_proizvod` (`usluga_proizvod_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kupljena_usluga`
--

LOCK TABLES `kupljena_usluga` WRITE;
/*!40000 ALTER TABLE `kupljena_usluga` DISABLE KEYS */;
/*!40000 ALTER TABLE `kupljena_usluga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_aktivnosti`
--

DROP TABLE IF EXISTS `log_aktivnosti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_aktivnosti` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `detalji` text COLLATE utf8mb4_unicode_ci,
  `ip_adresa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tip_aktivnosti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vrijeme_aktivnosti` datetime(6) NOT NULL,
  `korisnik_id` int DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `FKg408oueticx26qbsngk4lhot6` (`korisnik_id`),
  CONSTRAINT `FKg408oueticx26qbsngk4lhot6` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`korisnik_id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_aktivnosti`
--

LOCK TABLES `log_aktivnosti` WRITE;
/*!40000 ALTER TABLE `log_aktivnosti` DISABLE KEYS */;
INSERT INTO `log_aktivnosti` VALUES (1,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 17:55:15.409215',NULL),(2,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 17:56:16.742766',NULL),(3,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 18:09:09.139002',NULL),(4,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 18:09:41.778853',NULL),(5,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 18:11:30.415717',NULL),(6,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 18:12:17.799115',NULL),(7,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 18:14:46.317580',NULL),(8,'Neuspješan pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-03 18:16:41.123840',NULL),(9,'Uspješna prijava.','0:0:0:0:0:0:0:1','LOGIN','2026-06-03 18:35:40.721652',57),(10,'Uspješna prijava.','0:0:0:0:0:0:0:1','LOGIN','2026-06-03 18:37:06.875761',57),(11,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:18.170259',65),(12,'Pokušaj prijave za: kupac_t1@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 11:58:18.390470',NULL),(13,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:18.585812',66),(14,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:18.746902',67),(15,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:19.098152',65),(16,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:46.118614',65),(17,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:46.365613',66),(18,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:46.560406',67),(19,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:58:46.935783',65),(20,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 11:59:15.769922',65),(21,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 12:00:50.369364',65),(22,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 12:00:50.777293',66),(23,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 12:00:51.001711',67),(24,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 12:01:29.595402',65),(25,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 12:01:29.813466',65),(26,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 12:02:48.207304',66),(27,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 12:02:48.471437',65),(28,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:40:52.241753',65),(29,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:41:02.141424',67),(30,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 15:41:10.725446',65),(31,'Pokušaj prijave za: test@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:48:25.315759',NULL),(32,'Pokušaj prijave za: admin@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:49:08.508711',NULL),(33,'Pokušaj prijave za: marko123@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:49:08.602226',NULL),(34,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:11.973619',NULL),(35,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:12.099505',NULL),(36,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:12.227231',NULL),(37,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:12.353574',NULL),(38,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:12.477715',NULL),(39,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:12.613092',NULL),(40,'Pokušaj prijave za: admin@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:50:12.742516',NULL),(41,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:51:19.449814',12),(42,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 15:51:30.986256',12),(43,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:51:40.284965',12),(44,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 15:51:40.532132',12),(45,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:51:51.396644',12),(46,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:52:19.599298',12),(47,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:53:06.813886',12),(48,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:54:46.281967',12),(49,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:55:02.261937',69),(50,'Pokušaj prijave za: marko123@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 15:55:02.415127',NULL),(51,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 15:55:49.014541',69),(52,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 16:14:06.046304',12),(53,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 16:21:45.721188',12),(54,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 16:23:16.128051',12),(55,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 16:35:48.828856',12),(56,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 16:41:13.048367',78),(57,'Pokušaj prijave za: test.volonter@dobrobit.me','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 20:52:02.235274',NULL),(58,'Pokušaj prijave za: volonter_t1@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 20:52:26.264376',NULL),(59,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 20:58:01.185272',12),(60,'Pokušaj prijave za: dobrobit2026@outlook.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 20:58:24.003264',NULL),(61,'Pokušaj prijave za: volonter_t1@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 20:58:30.917343',NULL),(62,'Pokušaj prijave za: marko@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 20:58:38.072323',NULL),(63,'Pokušaj prijave za: jelena.radovic@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 20:58:38.292551',NULL),(64,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:08:16.487107',12),(65,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:13:34.971349',12),(66,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:25:07.750880',12),(67,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:30:11.225668',81),(68,'Pokušaj prijave za: test@test.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-08 21:37:18.816898',NULL),(69,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:37:30.324012',12),(70,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:41:50.114258',82),(71,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 21:48:11.292074',82),(72,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:48:30.256301',12),(73,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:56:54.252393',82),(74,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-08 21:57:58.433930',82),(75,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-08 21:58:13.705340',12),(76,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-09 07:30:45.116302',12),(77,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-09 16:17:07.072286',12),(78,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-09 16:18:09.845637',12),(79,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:02:35.287379',12),(80,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:07:54.875696',12),(81,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-10 16:26:28.557546',12),(82,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:26:56.100785',12),(83,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:27:34.020156',83),(84,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:28:33.787221',12),(85,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:28:59.967302',83),(86,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:48:56.364839',83),(87,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-10 16:50:31.507556',85),(88,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:50:37.242958',83),(89,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-10 16:52:21.624110',83),(90,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:52:27.550746',85),(91,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-10 16:52:41.681774',85),(92,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:52:47.168579',12),(93,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:53:16.896473',85),(94,NULL,'0:0:0:0:0:0:0:1','LOGOUT','2026-06-10 16:54:33.214597',85),(95,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 16:54:39.401489',83),(96,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 17:09:58.260487',83),(97,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 19:04:24.022881',86),(98,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-10 19:09:23.838837',83),(99,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 08:42:54.397874',87),(100,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 08:52:07.257636',87),(101,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 09:04:34.287790',87),(102,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 09:11:21.068778',87),(103,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 10:09:34.136920',12),(104,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 10:42:42.217908',12),(105,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 10:55:58.745985',12),(106,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 14:56:58.153688',12),(107,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 15:13:01.461519',12),(108,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 15:19:07.214459',12),(109,'Pokušaj prijave za: anastasijabulatovic7@gmail.com','0:0:0:0:0:0:0:1','LOGIN_NEUSPIO','2026-06-19 15:20:55.588597',NULL),(110,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 15:22:41.698661',12),(111,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 15:49:20.352482',12),(112,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 15:51:43.344231',12),(113,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 16:00:33.519694',12),(114,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 16:16:04.282916',12),(115,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 16:16:31.755957',12),(116,NULL,'0:0:0:0:0:0:0:1','LOGIN','2026-06-19 16:21:43.265783',12);
/*!40000 ALTER TABLE `log_aktivnosti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ocjena_recenzija`
--

DROP TABLE IF EXISTS `ocjena_recenzija`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ocjena_recenzija` (
  `ocjena_id` int NOT NULL AUTO_INCREMENT,
  `kupovina_id` int NOT NULL,
  `ocjenjivac_id` int NOT NULL,
  `broj_zvjezdica` int NOT NULL,
  `komentar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datum_ocjene` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ocjena_id`),
  UNIQUE KEY `kupovina_id` (`kupovina_id`),
  KEY `fk_ocjena_korisnik` (`ocjenjivac_id`),
  CONSTRAINT `fk_ocjena_korisnik` FOREIGN KEY (`ocjenjivac_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ocjena_kupovina` FOREIGN KEY (`kupovina_id`) REFERENCES `kupljena_usluga` (`kupovina_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ocjena_recenzija`
--

LOCK TABLES `ocjena_recenzija` WRITE;
/*!40000 ALTER TABLE `ocjena_recenzija` DISABLE KEYS */;
/*!40000 ALTER TABLE `ocjena_recenzija` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partner`
--

DROP TABLE IF EXISTS `partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `boja_pozadine` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kategorija` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kratko` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naziv` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opis` text COLLATE utf8mb4_unicode_ci,
  `redoslijed` int DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partner`
--

LOCK TABLES `partner` WRITE;
/*!40000 ALTER TABLE `partner` DISABLE KEYS */;
INSERT INTO `partner` VALUES (1,'linear-gradient(135deg,#003399,#0052cc)','Međunarodna organizacija','EU','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png','Evropska Unija','Evropska Unija podržava razvoj civilnog društva i humanitarnih inicijativa u regionu Zapadnog Balkana kroz različite programe finansiranja i saradnje.',1,'https://europa.eu'),(2,'linear-gradient(135deg,#1a1a2e,#16213e)','Tech klaster','ICT','https://logo.clearbit.com/ictcortex.me','ICT Cortex','ICT Cortex je klaster IT kompanija u Crnoj Gori koji promoviše digitalizaciju i inovacije. Podrška Dobrobitu odražava predanost društvenoj odgovornosti tech sektora.',2,'https://ictcortex.me'),(3,'linear-gradient(135deg,#0077b6,#00b4d8)','Međunarodna organizacija','UN','https://logo.clearbit.com/undp.org','UNDP Crna Gora','Program Ujedinjenih nacija za razvoj (UNDP) podržava projekte koji doprinose smanjenju siromaštva i jačanju inkluzivnih zajednica u Crnoj Gori.',3,'https://www.undp.org/montenegro'),(4,'linear-gradient(135deg,#cc0000,#ff3333)','Korporacija','MT','https://logo.clearbit.com/mtel.me','Mtel','Mtel je vodeći mobilni operater koji aktivno podržava digitalni razvoj zajednice i humanitarne projekte u Crnoj Gori.',4,'https://www.mtel.me'),(5,'linear-gradient(135deg,#e67e22,#f39c12)','Fondacija','TF','https://logo.clearbit.com/tragfondacija.org','TRAG Fondacija','TRAG fondacija podržava razvoj lokalnih zajednica i civilnog društva u zemljama Zapadnog Balkana kroz grantove i programe jačanja kapaciteta.',5,'https://www.tragfondacija.org'),(6,'linear-gradient(135deg,#8e44ad,#9b59b6)','Nevladina organizacija','CE','https://logo.clearbit.com/cemi.org.me','CEMI','Centar za monitoring i istraživanje (CEMI) promoviše demokratske vrijednosti, vladavinu prava i transparentnost kroz istraživanje i građansko obrazovanje.',6,'https://www.cemi.org.me');
/*!40000 ALTER TABLE `partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pomogli_slucaj`
--

DROP TABLE IF EXISTS `pomogli_slucaj`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pomogli_slucaj` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `boja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datum_dodavanja` datetime(6) DEFAULT NULL,
  `naslov` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redoslijed` int DEFAULT NULL,
  `tekst` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pomogli_slucaj`
--

LOCK TABLES `pomogli_slucaj` WRITE;
/*!40000 ALTER TABLE `pomogli_slucaj` DISABLE KEYS */;
INSERT INTO `pomogli_slucaj` VALUES (1,'plava','2026-06-19 10:10:35.223458','Marko Markovic',1,'Postoje trenuci kada čovjek pomisli da je ostao sam. Nakon saobraćajne nesreće koja me je spriječila da radim, svakodnevni troškovi, liječenje i briga o porodici postali su teret koji nisam mogao sam da nosim.\nTada sam upoznao ljude koji su pokazali da dobrota i dalje postoji. Ova platforma mi je,pored finansijske pomoći pružila i nešto više. \nOsjetio sam se zaštićeno,ušuškano.\nOsjetio sam da me neko čuje i vidi.\n Svaki volonter koji je izdvojio svoje vrijeme i svaki donator koji je odlučio da pomogne postali su dio moje priče o oporavku.\nDanas sam korak bliže tome da ponovo stanem na svoje noge. Zahvalan sam svima koji su vjerovali u mene onda kada mi je to bilo najpotrebnije.\n'),(2,'roza1','2026-06-19 10:18:42.222721','Marija Maric',2,'Kada je mom sinu dijagnostikovana teška bolest, naš život se promijenio preko noći. Dani su postali ispunjeni pregledima, terapijama i neizvjesnošću.\nBila sam prožeta osjećajem bespomoćnosti,što je za jednog  roditelja najteže.\nPomoć koja je stigla preko Dobrobiti nije bila samo podrška za liječenje. Bila je podsjetnik da ovo društvo nudi nešto više.Ljudi koje nikada nisam upoznala odlučili su da nam pruže ruku onda kada nam je bila najpotrebnija.\n\nZahvaljujući toj podršci uspjeli smo da obezbijedimo dio terapija koje su našem sinu bile neophodne. Danas se i dalje borimo, ali više ne osjećamo isti strah i bespomoćnost.\nOd srca hvala svakome ko je izdvojio dio svog vremena, novca ili znanja da pomogne našoj porodici. \n.\n\n'),(3,'roza2','2026-06-19 10:24:13.844792','Milica Mitrovic',3,'Moj otac je cijelog života radio. Bio je čovjek koji nikada nije tražio pomoć i koji je uvijek vjerovao da će se za sve izboriti svojim rukama. Kada je obolio , prvi put sam ga vidjela da ćuti pred problemom koji nije mogao sam da riješi.Troškovi terapije su prevazilazili naše mogućnosti. U tom periodu straha i neizvjesnosti, DobroBit je bila tu da nam pruži ruku. Potpisali smo ugovor,prijavili se.\nOnda su počele da stižu donacije.\nI shvatiš da nisi sam.\nI shvatiš da Ne moraš biti sam.\nI vjerujem da ljudi nisu svjesni Koliko jedan njihov klik,jedna ponuđena usluga znači. I možda ni neće znati. Ali ja hoću. I zato vam hvala.\n\n');
/*!40000 ALTER TABLE `pomogli_slucaj` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profil`
--

DROP TABLE IF EXISTS `profil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profil` (
  `profil_id` int NOT NULL AUTO_INCREMENT,
  `korisnik_id` int NOT NULL,
  `opis` text COLLATE utf8mb4_unicode_ci,
  `profilna_slika` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portfolio_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prosjecna_ocjena` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`profil_id`),
  UNIQUE KEY `korisnik_id` (`korisnik_id`),
  CONSTRAINT `fk_profil_korisnik` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profil`
--

LOCK TABLES `profil` WRITE;
/*!40000 ALTER TABLE `profil` DISABLE KEYS */;
INSERT INTO `profil` VALUES (1,65,'Moj profil',NULL,'Sarajevo',NULL,NULL);
/*!40000 ALTER TABLE `profil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usluga_proizvod`
--

DROP TABLE IF EXISTS `usluga_proizvod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usluga_proizvod` (
  `usluga_proizvod_id` int NOT NULL AUTO_INCREMENT,
  `volonter_id` int NOT NULL,
  `kategorija_id` int NOT NULL,
  `naziv` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cijena` decimal(38,2) DEFAULT NULL,
  `status_objave` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datum_kreiranja` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kapacitet` int DEFAULT NULL,
  PRIMARY KEY (`usluga_proizvod_id`),
  KEY `fk_usluga_kategorija` (`kategorija_id`),
  KEY `idx_usluga_status` (`status_objave`),
  KEY `FKnsflno1qthxnx3bw7tl78lhg0` (`volonter_id`),
  CONSTRAINT `fk_usluga_kategorija` FOREIGN KEY (`kategorija_id`) REFERENCES `kategorija` (`kategorija_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_usluga_volonter` FOREIGN KEY (`volonter_id`) REFERENCES `volonter_info` (`volonter_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FKnsflno1qthxnx3bw7tl78lhg0` FOREIGN KEY (`volonter_id`) REFERENCES `korisnik` (`korisnik_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usluga_proizvod`
--

LOCK TABLES `usluga_proizvod` WRITE;
/*!40000 ALTER TABLE `usluga_proizvod` DISABLE KEYS */;
INSERT INTO `usluga_proizvod` VALUES (1,10,1,'IT Podrška','Online pomoć','usluga',30.00,'aktivna','2026-06-03 17:45:28',NULL),(3,66,11,'Test Usluga','Test opis','usluga',50.00,'uklonjena','2026-06-08 12:02:49',NULL),(4,10,1,'IT Popravke i Podrška','Dijagnostika i popravka racunara, instalacija softvera','usluga',30.00,'aktivna','2026-06-08 18:07:55',NULL),(20,7,2,'Online Lekcije – Matematika','Individualne online lekcije iz matematike za sve uzraste','usluga',20.00,'aktivna','2026-06-08 18:12:12',NULL),(21,7,1,'Online Lekcije – Programiranje','Python, JavaScript i web razvoj za pocetnike i napredne','usluga',25.00,'aktivna','2026-06-08 18:12:12',NULL),(22,71,2,'Prevođenje Dokumenata','Prevod sa/na engleski i njemacki, strucni i licni dokumenti','usluga',15.00,'aktivna','2026-06-08 18:12:12',NULL),(23,71,2,'Pisanje i Copywriting','Pisanje clanaka, blogova, opisa proizvoda i web sadrzaja','usluga',18.00,'aktivna','2026-06-08 18:12:12',NULL),(24,72,4,'PC Popravke i Montaža Mreže','Fizicke popravke, nadogradnja hardvera, instalacija mreze','usluga',35.00,'uklonjena','2026-06-08 18:12:12',NULL),(25,73,3,'Life Coaching – 1:1 Seanse','Online individualne seanse za licni razvoj i postavljanje ciljeva','usluga',40.00,'aktivna','2026-06-08 18:12:12',NULL),(26,74,3,'Astrološki Horoskop','Personalizovani godisnji horoskop i numeroloski izracun','usluga',25.00,'aktivna','2026-06-08 18:12:12',NULL),(27,78,2,'Test direktni','Opis test','usluga',15.00,'odbijena','2026-06-08 23:01:22',NULL),(28,83,12,'Med','','usluga',20.00,'aktivna','2026-06-10 16:28:11',5),(29,83,13,'Birth Chart','','usluga',200.00,'popunjeno','2026-06-10 16:52:16',1);
/*!40000 ALTER TABLE `usluga_proizvod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verifikacija`
--

DROP TABLE IF EXISTS `verifikacija`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verifikacija` (
  `verifikacija_id` int NOT NULL AUTO_INCREMENT,
  `korisnik_id` int DEFAULT NULL,
  `usluga_proizvod_id` int DEFAULT NULL,
  `administrator_id` int NOT NULL,
  `tip_verifikacije` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `napomena` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datum_verifikacije` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`verifikacija_id`),
  KEY `fk_verifikacija_korisnik` (`korisnik_id`),
  KEY `fk_verifikacija_usluga` (`usluga_proizvod_id`),
  KEY `idx_verifikacija_admin` (`administrator_id`),
  CONSTRAINT `fk_verifikacija_admin` FOREIGN KEY (`administrator_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_verifikacija_korisnik` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_verifikacija_usluga` FOREIGN KEY (`usluga_proizvod_id`) REFERENCES `usluga_proizvod` (`usluga_proizvod_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verifikacija`
--

LOCK TABLES `verifikacija` WRITE;
/*!40000 ALTER TABLE `verifikacija` DISABLE KEYS */;
INSERT INTO `verifikacija` VALUES (1,66,NULL,67,'volonter','na_cekanju','Test verifikacija','2026-06-08 12:01:31');
/*!40000 ALTER TABLE `verifikacija` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volonter_info`
--

DROP TABLE IF EXISTS `volonter_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volonter_info` (
  `volonter_id` int NOT NULL,
  `biografija` text COLLATE utf8mb4_unicode_ci,
  `broj_usluga` int NOT NULL DEFAULT '0',
  `portfolio_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`volonter_id`),
  CONSTRAINT `fk_volonter_info_korisnik` FOREIGN KEY (`volonter_id`) REFERENCES `korisnik` (`korisnik_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volonter_info`
--

LOCK TABLES `volonter_info` WRITE;
/*!40000 ALTER TABLE `volonter_info` DISABLE KEYS */;
INSERT INTO `volonter_info` VALUES (7,'Online predavac matematike i programiranja sa vise od 5 godina iskustva',4,NULL,NULL),(10,'',1,'',NULL),(66,'Bio volontera',0,'https://portfolio.example.com',NULL),(71,'Prevodioc i copywriter – engleski, njemacki, pisanje clanaka',2,NULL,NULL),(72,'IT strucnjak – popravke racunara, nadogradnja hardvera, montaza mreza',1,NULL,NULL),(73,'Sertifikovani life-coach sa iskustvom u licnom razvoju i motivaciji',1,NULL,NULL),(74,'Profesionalni astrolog i numerolog sa 10+ godina iskustva',2,NULL,NULL),(78,'Ja sam student pmf-a,treca godina.Osjetila sam potrebu da doprinesem svojim znanjem i vjestinama.',0,NULL,NULL),(79,'',0,'','/api/upload/cv/d54b71a8-1a6d-4a6f-9c21-3d0e27896c02_Zadaci_RI_KSG_DKA.pdf'),(83,'',2,'','/api/upload/cv/838ed21a-9311-4483-9f8d-1eb285ecf450_CV.pdf'),(84,'',0,'','/api/upload/cv/754c1ecb-15ec-4c2a-8301-06244b998be6_CV.pdf');
/*!40000 ALTER TABLE `volonter_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-19 18:25:39

