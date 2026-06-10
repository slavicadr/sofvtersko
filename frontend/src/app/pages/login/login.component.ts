import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';

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
  loginError = '';
  regError = '';
  sessionExpiredNotice = false;

  loginErrors: any = {};

  loginForm = { email: '', password: '' };

  regForm = {
    role: 'BUYER' as 'VOLUNTEER' | 'BUYER',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    portfolioLink: '',
    password: '',
    displayPreference: 'name',
    acceptedTerms: false,
    services: [{ name: '', price: null, category: '', description: '' }],
  };

  emailTaken = false;
  emailChecking = false;

  cvFile: File | null = null;
  cvUploading = false;
  cvFileName = '';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) this.activeTab = params['tab'];
      if (params['uloga'] === 'volonter') {
        this.activeTab = 'register';
        this.regForm.role = 'VOLUNTEER';
      }
      if (params['sessionExpired'] === 'true') this.sessionExpiredNotice = true;
    });
  }

  setTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.loginError = '';
    this.regError = '';
    this.emailTaken = false;
  }

  onEmailBlur() {
    const email = this.regForm.email.trim();
    if (!email || !email.includes('@')) { this.emailTaken = false; return; }
    this.emailChecking = true;
    this.auth.checkEmail(email).subscribe({
      next: (res) => { this.emailTaken = res.postoji; this.emailChecking = false; },
      error: () => { this.emailChecking = false; }
    });
  }

  addService() {
    this.regForm.services.push({ name: '', price: null, category: '', description: '' });
  }

  removeService(index: number) {
    this.regForm.services.splice(index, 1);
  }

  onLogin() {
    this.loginErrors = {};
    this.loginError = '';
    if (!this.loginForm.email) { this.loginErrors.email = 'Email je obavezan'; return; }
    if (!this.loginForm.password) { this.loginErrors.password = 'Lozinka je obavezna'; return; }

    this.loginLoading = true;
    this.auth.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: () => {
        this.loginLoading = false;
        this.router.navigate([this.auth.getDashboardRoute()]);
      },
      error: (err) => {
        this.loginLoading = false;
        this.loginError = err.error ?? 'Pogrešan email ili lozinka.';
      }
    });
  }

  onCvFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const f = input.files[0];
      if (f.type !== 'application/pdf') {
        alert('Dozvoljeni su samo PDF fajlovi.');
        input.value = '';
        return;
      }
      if (f.size > 15 * 1024 * 1024) {
        alert('CV ne smije biti veći od 15 MB.');
        input.value = '';
        return;
      }
      this.cvFile = f;
      this.cvFileName = f.name;
    }
  }

  removeCv() {
    this.cvFile = null;
    this.cvFileName = '';
  }

  onRegister() {
    this.regError = '';
    if (!this.regForm.acceptedTerms) return;
    if (this.emailTaken) { this.regError = 'Ova email adresa je već registrovana.'; return; }

    this.regLoading = true;

    const payload: any = {
      ime: this.regForm.firstName,
      prezime: this.regForm.lastName,
      email: this.regForm.email,
      lozinkaHash: this.regForm.password,
      telefon: this.regForm.phone,
      prikazAnonimno: this.regForm.displayPreference === 'anonymous',
    };

    if (this.regForm.role === 'VOLUNTEER') {
      payload.tipKorisnika = 'volonter';
      payload.opis = this.regForm.bio || '';
      payload.portfolioLinkTemp = this.regForm.portfolioLink || '';

      const doRegister = (cvUrl: string) => {
        payload.cvUrlTemp = cvUrl;
        this.auth.registerVolonter(payload).subscribe({
          next: () => {
            this.regLoading = false;
            this.activeTab = 'login';
            alert('Vaš profil je poslan na verifikaciju administratoru. Bićete obaviješteni putem emaila.');
          },
          error: (err) => {
            this.regLoading = false;
            this.regError = err.error ?? 'Greška pri registraciji.';
          }
        });
      };

      if (this.cvFile) {
        this.cvUploading = true;
        const form = new FormData();
        form.append('file', this.cvFile);
        this.http.post<{ url: string }>('/api/upload/cv', form).subscribe({
          next: (res) => { this.cvUploading = false; doRegister(res.url); },
          error: () => { this.cvUploading = false; doRegister(''); }
        });
      } else {
        doRegister('');
      }
    } else {
      payload.tipKorisnika = 'kupac';
      this.auth.registerKupac(payload).subscribe({
        next: () => {
          this.regLoading = false;
          this.router.navigate(['/kupac/dashboard']);
        },
        error: (err) => {
          this.regLoading = false;
          this.regError = err.error ?? 'Greška pri registraciji.';
        }
      });
    }
  }
}
