import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registracija', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'o-nama', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'slucajevi', loadComponent: () => import('./pages/cases/cases.component').then(m => m.CasesComponent) },
  { path: 'usluge', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent) },
  { path: 'donacije', loadComponent: () => import('./pages/donations/donations.component').then(m => m.DonationsComponent) },
  { path: 'placanje', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent) },
  { path: 'volonter/dashboard', loadComponent: () => import('./pages/volunteer-dashboard/volunteer-dashboard.component').then(m => m.VolunteerDashboardComponent) },
  { path: 'kupac/dashboard', loadComponent: () => import('./pages/buyer-dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent) },
  { path: 'admin/dashboard', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' }
];
