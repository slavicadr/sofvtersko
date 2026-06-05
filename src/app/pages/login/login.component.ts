import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  logoPath = 'assets/logoFinally.jpg';
  activeTab: 'login' | 'register' = 'login';
  showPassword = false;
  showRegPassword = false;
  loginLoading = false;
  regLoading = false;

  loginErrors: any = {};

  loginForm = { email: '', password: '' };

  regForm = {
    role: 'BUYER' as 'VOLUNTEER' | 'BUYER',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    password: '',
    displayPreference: 'name',
    acceptedTerms: false,
    services: [{ name: '', price: null, category: '', description: '' }],
  };

  categories = [
    'Edukacija', 'Zdravlje', 'IT pomoć', 'Prevoz', 'Kućni popravci',
    'Njega starijih', 'Hrana', 'Pravna pomoć', 'Psihološka podrška', 'Ostalo'
  ];

  trustBadges = [
    {
      phIcon: 'ph-lock-simple',
      iconBg: 'linear-gradient(135deg,var(--mint-to),var(--mint-from))',
      title: 'Sigurni podaci',
      desc: 'Vaši lični podaci su zaštićeni i nikad se ne dijele',
    },
    {
      phIcon: 'ph-check-circle',
      iconBg: 'linear-gradient(135deg,var(--lime-to),var(--lime-from))',
      title: 'Verifikovani volonteri',
      desc: 'Svaki volonter prolazi kroz verifikaciju administratora',
    },
    {
      phIcon: 'ph-credit-card',
      iconBg: 'linear-gradient(135deg,var(--peach-to),var(--peach-from))',
      title: 'Transparentno plaćanje',
      desc: 'Svaka donacija i kupovina je transparentan i bez posredovanja',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) this.activeTab = params['tab'];
      if (params['uloga'] === 'volonter') {
        this.activeTab = 'register';
        this.regForm.role = 'VOLUNTEER';
      }
    });
  }

  setTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  addService() {
    this.regForm.services.push({ name: '', price: null, category: '', description: '' });
  }

  removeService(index: number) {
    this.regForm.services.splice(index, 1);
  }

  onLogin() {
    this.loginErrors = {};
    if (!this.loginForm.email) { this.loginErrors.email = 'Email je obavezan'; return; }
    if (!this.loginForm.password) { this.loginErrors.password = 'Lozinka je obavezna'; return; }

    this.loginLoading = true;
    // TODO: Poveži sa AuthService
    setTimeout(() => {
      this.loginLoading = false;
      // Mock: redirect based on role
      this.router.navigate(['/volonter/dashboard']);
    }, 1200);
  }

  onRegister() {
    if (!this.regForm.acceptedTerms) return;
    if (this.regForm.role === 'VOLUNTEER' &&
        this.regForm.services.every(s => !s.name)) {
      alert('Morate dodati barem jednu uslugu ili proizvod.');
      return;
    }

    this.regLoading = true;
    // TODO: Poveži sa RegisterService
    setTimeout(() => {
      this.regLoading = false;
      if (this.regForm.role === 'VOLUNTEER') {
        alert('Vaš profil je poslan na verifikaciju administratoru. Bićete obaviješteni putem emaila.');
      } else {
        this.router.navigate(['/kupac/dashboard']);
      }
    }, 1400);
  }
}
