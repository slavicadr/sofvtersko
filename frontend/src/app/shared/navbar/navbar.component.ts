import { Component, OnInit, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccessibilityService } from '../../core/services/accessibility.service';
import { AuthService } from '../../core/services/auth.service';

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
  a11yPanelOpen = false;

  currentUser: { firstName: string; lastName: string; avatarUrl: string; role: string } | null = null;

  get a11y() { return this.a11yService.settings; }

  colorblindModes = [
    { label: 'Normalno',     value: 'none',         c1: '#e74c3c', c2: '#2ecc71', c3: '#3498db' },
    { label: 'Protanopija',  value: 'protanopia',   c1: '#b5a642', c2: '#0078d4', c3: '#ff8c00' },
    { label: 'Deuteranop.',  value: 'deuteranopia', c1: '#e6a817', c2: '#4080c0', c3: '#8040a0' },
    { label: 'Tritanopija',  value: 'tritanopia',   c1: '#cc0000', c2: '#00aacc', c3: '#ff88cc' },
  ];

  constructor(
    private router: Router,
    private a11yService: AccessibilityService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user ? {
        firstName: user.ime,
        lastName: user.prezime,
        avatarUrl: '',
        role: user.tipKorisnika,
      } : null;
    });
  }

  @HostListener('window:scroll')
  onScroll() { this.isScrolled = window.scrollY > 20; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const t = e.target as HTMLElement;
    if (!t.closest('.navbar-user') && !t.closest('.navbar-dropdown')) this.userMenuOpen = false;
    if (!t.closest('.a11y-fab') && !t.closest('.a11y-panel')) this.a11yPanelOpen = false;
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
    return this.auth.getDashboardRoute();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => { this.userMenuOpen = false; this.router.navigate(['/']); },
      error: () => { this.userMenuOpen = false; this.router.navigate(['/']); }
    });
  }

  // ── A11y delegates ───────────────────────────────────────
  setFontSize(s: any)        { this.a11yService.setFontSize(s); }
  toggleDyslexia()           { this.a11yService.toggleDyslexia(); }
  toggleLineSpacing()        { this.a11yService.toggleLineSpacing(); }
  toggleLetterSpacing()      { this.a11yService.toggleLetterSpacing(); }
  toggleHighContrast()       { this.a11yService.toggleHighContrast(); }
  toggleDarkMode()           { this.a11yService.toggleDarkMode(); }
  setColorblindMode(m: any)  { this.a11yService.setColorblindMode(m); }
  toggleReduceMotion()       { this.a11yService.toggleReduceMotion(); }
  toggleFocusHighlight()     { this.a11yService.toggleFocusHighlight(); }
  toggleLargeCursor()        { this.a11yService.toggleLargeCursor(); }
  toggleAudio()              { this.a11yService.toggleAudio(); }
  resetA11y()                { this.a11yService.resetAll(); }
}
