import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AccessibilityService } from '../../core/services/accessibility.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // ── Logo: putanja je relativna na /assets folder ──────────
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  donationModalOpen = false;
  selectedCase: any = null;
  donationAmount = 10;
  donorDisplay = 'name';
  donationAmounts = [5, 10, 25, 50, 100];

  // A11y panel na početnoj (FAB dugme) — delegira na navbar servis
  a11yPanelOpen = false;

  stats = [
    { value: '128',   label: 'Aktivnih volontera' },
    { value: '45',    label: 'Humanitarnih slučajeva' },
    { value: '1.230', label: 'Izvršenih transakcija' },
    { value: '98%',   label: 'Zadovoljnih korisnika' },
  ];

  activeCases = [
    { name:'Petar Stojanović', description:'Ogromni troškovi terapije',
      fullDesc:'Bolest zahtijeva skupo liječenje - svaka pomoć je dragocjena.',
      raised:1750, goal:2500, percent:70, category:'Zdravlje', photoUrl:'',
      avatarBg:'linear-gradient(135deg,var(--mint-to),var(--mint-from))',
      imgBg:'linear-gradient(135deg,var(--mint-to),var(--mint-from))',
      tagBg:'var(--mint-to)', tagColor:'#2d6b55' },
    { name:'Marija Nikolić', description:'Samohrana majka troje djece',
      fullDesc:'Samohrana majka troje djece - potrebna pomoć za hranu i školovanje djece.',
      raised:2400, goal:5000, percent:48, category:'Socijalna zaštita', photoUrl:'',
      avatarBg:'linear-gradient(135deg,var(--lime-to),var(--lime-from))',
      imgBg:'linear-gradient(135deg,var(--lime-to),var(--lime-from))',
      tagBg:'var(--lime-to)', tagColor:'#4a6e1a' },
    { name:'Maja Luković', description:'Potrebna operacija srca',
      fullDesc:'',
      raised:900, goal:2400, percent:37, category:'Socijalna zaštita', photoUrl:'',
      avatarBg:'linear-gradient(135deg,var(--peach-to),var(--peach-from))',
      imgBg:'linear-gradient(135deg,var(--peach-to),var(--peach-from))',
      tagBg:'var(--peach-to)', tagColor:'#8a5a2a' },
  ];

  roles = [
    { icon:'🤝', iconBg:'linear-gradient(135deg,var(--mint-to),var(--mint-from))', title:'Volonter', desc:'Ponudite uslugu ili proizvod besplatno', items:['Registrujte profil i dodajte uslugu','Administrator verifikuje Vaš profil','Odaberite korisnika pomoći'] },
    { icon:'🛒', iconBg:'linear-gradient(135deg,var(--lime-to),var(--lime-from))', title:'Kupac', desc:'Kupite usluge ili proizvode od volontra', items:['Kreirajte nalog i pregledajte ponude','Bezbjedno plaćanje karticom','Ostavite recenziju nakon kupovine'] },
    { icon:'💝', iconBg:'linear-gradient(135deg,var(--peach-to),var(--peach-from))', title:'Donator', desc:'Direktno donirajte bez kreiranja naloga - brzo i jednostavno.', items:['Ne treba vam nalog','Odaberite korisnika i iznos','Prikaz u javnoj listi donacija'] },
    { icon:'🌟', iconBg:'linear-gradient(135deg,var(--lime-to),var(--mint-from))', title:'Korisnik pomoći', desc:'Lice ili organizacija kojoj je pomoć potrebna ', items:['Registracija i potpisivanje ugovora','Praćenje primljenih donacija','Zaštita privatnosti'] },
  ];

  reviews = [
    { stars:'★★★★★', initials:'SK', avatarUrl:'', text:'Profesionalne i zanimljive lekcije. Marko je odličan predavač!', name:'Srđan Kadić', service:'Online Lekcije' },
    { stars:'★★★★★', initials:'AK', avatarUrl:'', text:'Isplativo online savjetovanje - preporučujem svima.', name:'Aleksa Kovačević', service:'Online Konsalting' },
    { stars:'★★★★☆', initials:'NP', avatarUrl:'', text:'Sjajan osjećaj kada znam da moje kupovine direktno pomažu nekome.', name:'Nina Perović', service:'Popravka kućanstva' },
  ];

  featuredVolunteers = [
    { name:'Marko Vešović', title:'Online predavač (Matematika & IT)', rating:'4.9', reviewsCount:24, photoUrl:'assets/volonteri/volonter1.jpg', skills:['Podučavanje','Programiranje'], bgGradient:'linear-gradient(135deg,rgba(168,221,208,0.3),rgba(184,224,128,0.2))' },
    { name:'Jelena Radović', title:'Prevođenje i pisanje članaka', rating:'5.0', reviewsCount:18, photoUrl:'assets/volonteri/volonter2.jpg', skills:['Engleski','Copywriting'], bgGradient:'linear-gradient(135deg,rgba(168,221,208,0.3),rgba(184,224,128,0.2))' },
    { name:'Nikola Popović', title:'It stručnjak', rating:'4.8', reviewsCount:32, photoUrl:'assets/volonteri/volonter4.png', skills:['Popravke','Montaža'], bgGradient:'linear-gradient(135deg,rgba(168,221,208,0.3),rgba(184,224,128,0.2))' },
      { name:'Evica Bulatović', title:'Life-coach', rating:'5.0', reviewsCount:11, photoUrl:'assets/volonteri/volonter6.png', skills:['Motivacija','Savjeti'], bgGradient:'linear-gradient(135deg,rgba(168,221,208,0.3),rgba(184,224,128,0.2))' },
    { name:'Ratka Laban', title:'Astrolog', rating:'4.9', reviewsCount:15, photoUrl:'assets/volonteri/volonter5.png', skills:['Horoskop','Savjeti'], bgGradient:'linear-gradient(135deg,rgba(168,221,208,0.3),rgba(184,224,128,0.2))' }
  
  ];


  aboutValues = [
    { icon:'ph-shield-check', bg:'linear-gradient(135deg,#2d6b55,#3d8c6e)', title:'Povjerenje',desc:'' },
    { icon:'ph-lock-simple', bg:'linear-gradient(135deg,#1565c0,#1976d2)', title:'Sigurnost',desc:'' },
    { icon:'ph-handshake', bg:'linear-gradient(135deg,#7ab648,#5a9e28)', title:'Solidarnost',desc:'' },
    { icon:'ph-person-arms-spread', bg:'linear-gradient(135deg,#e67e22,#d35400)', title:'Inkluzija', desc:'' },
  ];

  teamMembers = [
    { name:'Isidora Mujović', role:'Developer', initials:'IM', bg:'linear-gradient(135deg,#a8ddd0,#c8ede4)' },
    { name:'Slavica Drobnjak', role:'Developer', initials:'SD', bg:'linear-gradient(135deg,#b8e080,#d4f09a)' },
    { name:'Anastasija Bulatović', role:'Developer', initials:'AB', bg:'linear-gradient(135deg,#f0c89e,#fce0c0)' },
  ];

  constructor(private a11yService: AccessibilityService) {}

  ngOnInit() {}
  ngAfterViewInit() { this.initScrollAnimations(); }

  initScrollAnimations() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
  }

  openDonation(c: any)  { this.selectedCase = c; this.donationAmount = 10; this.donationModalOpen = true; }
  closeDonation()        { this.donationModalOpen = false; }
  confirmDonation()      { alert(`Donacija od ${this.donationAmount}€ za ${this.selectedCase?.name} je uspješna!`); this.donationModalOpen = false; }
}
