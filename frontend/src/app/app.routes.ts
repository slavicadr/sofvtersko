import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registracija', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'o-nama', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'slucajevi', loadComponent: () => import('./pages/cases/cases.component').then(m => m.CasesComponent) },
  { path: 'usluge', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
  { path: 'donacije', loadComponent: () => import('./pages/donations/donations.component').then(m => m.DonationsComponent) },
  { path: 'placanje', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'hvala', loadComponent: () => import('./pages/thank-you/thank-you.component').then(m => m.ThankYouComponent) },
  { path: 'volonter/dashboard', canActivate: [roleGuard(['volonter'])], loadComponent: () => import('./pages/volunteer-dashboard/volunteer-dashboard.component').then(m => m.VolunteerDashboardComponent) },
  { path: 'kupac/dashboard', canActivate: [roleGuard(['kupac'])], loadComponent: () => import('./pages/buyer-dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent) },
  { path: 'admin/dashboard', canActivate: [roleGuard(['administrator'])], loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
  { path: 'uslovi', loadComponent: () => import('./pages/uslovi-koriscenja/uslovi-koriscenja.component').then(m => m.UsloviKoriscenjaComponent) },
  { path: 'uslovi-koriscenja', loadComponent: () => import('./pages/uslovi-koriscenja/uslovi-koriscenja.component').then(m => m.UsloviKoriscenjaComponent) },
  { path: 'privatnost', loadComponent: () => import('./pages/politika-privatnosti/politika-privatnosti.component').then(m => m.PolitikaPrivatnostiComponent) },
  { path: 'politika-privatnosti', loadComponent: () => import('./pages/politika-privatnosti/politika-privatnosti.component').then(m => m.PolitikaPrivatnostiComponent) },
  { path: 'pravni-ugovor', loadComponent: () => import('./pages/pravni-ugovor/pravni-ugovor.component').then(m => m.PravniUgovorComponent) },
  { path: '**', redirectTo: '' }
];
