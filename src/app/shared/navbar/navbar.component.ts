import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccessibilityService } from '../../core/services/accessibility.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() logoImagePath: string = 'assets/logoFinally.jpg';

  isScrolled = false;
  userMenuOpen = false;
  mobileMenuOpen = false;
  searchQuery = '';
  currentUser: any = null;
  a11yPanelOpen = false;

  get a11y() { return this.a11yService.settings; }

  colorblindModes = [
    { label: 'Normalno',     value: 'none',         c1: '#e74c3c', c2: '#2ecc71', c3: '#3498db' },
    { label: 'Protanopija',  value: 'protanopia',   c1: '#b5a642', c2: '#0078d4', c3: '#ff8c00' },
    { label: 'Deuteranop.',  value: 'deuteranopia', c1: '#e6a817', c2: '#4080c0', c3: '#8040a0' },
    { label: 'Tritanopija',  value: 'tritanopia',   c1: '#cc0000', c2: '#00aacc', c3: '#ff88cc' },
  ];

  constructor(private router: Router, private a11yService: AccessibilityService) {}

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll() { this.isScrolled = window.scrollY > 20; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const t = e.target as HTMLElement;
    if (!t.closest('.navbar-user') && !t.closest('.navbar-dropdown')) this.userMenuOpen = false;
    if (!t.closest('.a11y-fab-btn') && !t.closest('.a11y-panel')) this.a11yPanelOpen = false;
  }

  toggleUserMenu()   { this.userMenuOpen   = !this.userMenuOpen; }
  toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu()  { this.mobileMenuOpen = false; }
  toggleA11yPanel()  { this.a11yPanelOpen  = !this.a11yPanelOpen; }
  closeA11yPanel()   { this.a11yPanelOpen  = false; }

  onSearch() {
    if (this.searchQuery.trim()) this.router.navigate(['/usluge'], { queryParams: { q: this.searchQuery } });
  }

  getDashboardRoute(): string {
    if (!this.currentUser) return '/';
    const m: any = { VOLUNTEER: '/volonter/dashboard', BUYER: '/kupac/dashboard', ADMIN: '/admin/dashboard' };
    return m[this.currentUser.role] || '/';
  }

  logout() { this.currentUser = null; this.userMenuOpen = false; this.router.navigate(['/']); }

  // ── A11y delegates ───────────────────────────────────────
  setFontSize(s: any)        { this.a11yService.setFontSize(s); }
  toggleDyslexia()           { this.a11yService.toggleDyslexia(); }
  toggleLineSpacing()        { this.a11yService.toggleLineSpacing(); }
  toggleLetterSpacing()      { this.a11yService.toggleLetterSpacing(); }
  toggleHighContrast()       { this.a11yService.toggleHighContrast(); }
  setColorblindMode(m: any)  { this.a11yService.setColorblindMode(m); }
  toggleReduceMotion()       { this.a11yService.toggleReduceMotion(); }
  toggleAudio()              { this.a11yService.toggleAudio(); }
  resetA11y()                { this.a11yService.resetAll(); }
}
