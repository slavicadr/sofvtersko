import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-donatori',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './donatori.component.html',
  styleUrls: ['./donatori.component.scss']
})
export class DonatorComponent {
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  onLogoError(event: Event, boja: string, kratko: string) {
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement!;
    img.style.display = 'none';
    parent.style.background = boja;
    parent.innerHTML = `<span style="font-size:1.6rem;font-weight:800;color:rgba(255,255,255,0.9);letter-spacing:2px;">${kratko}</span>`;
  }

  donatori = [
    {
      naziv: 'Evropska Unija',
      kratko: 'EU',
      opis: 'Evropska Unija podržava razvoj civilnog društva i humanitarnih inicijativa u regionu Zapadnog Balkana kroz različite programe finansiranja i saradnje.',
      website: 'https://europa.eu',
      kategorija: 'Međunarodna organizacija',
      boja: 'linear-gradient(135deg,#003399,#0052cc)',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png'
    },
    {
      naziv: 'ICT Cortex',
      kratko: 'ICT',
      opis: 'ICT Cortex je klaster IT kompanija u Crnoj Gori koji promoviše digitalizaciju i inovacije. Podrška Dobrobitu odražava predanost društvenoj odgovornosti tech sektora.',
      website: 'https://ictcortex.me',
      kategorija: 'Tech klaster',
      boja: 'linear-gradient(135deg,#1a1a2e,#16213e)',
      logoUrl: 'https://logo.clearbit.com/ictcortex.me'
    },
    {
      naziv: 'UNDP Crna Gora',
      kratko: 'UN',
      opis: 'Program Ujedinjenih nacija za razvoj (UNDP) podržava projekte koji doprinose smanjenju siromaštva i jačanju inkluzivnih zajednica u Crnoj Gori.',
      website: 'https://www.undp.org/montenegro',
      kategorija: 'Međunarodna organizacija',
      boja: 'linear-gradient(135deg,#0077b6,#00b4d8)',
      logoUrl: 'https://logo.clearbit.com/undp.org'
    },
    {
      naziv: 'Mtel',
      kratko: 'MT',
      opis: 'Mtel je vodeći mobilni operater koji aktivno podržava digitalni razvoj zajednice i humanitarne projekte u Crnoj Gori.',
      website: 'https://www.mtel.me',
      kategorija: 'Korporacija',
      boja: 'linear-gradient(135deg,#cc0000,#ff3333)',
      logoUrl: 'https://logo.clearbit.com/mtel.me'
    },
    {
      naziv: 'TRAG Fondacija',
      kratko: 'TF',
      opis: 'TRAG fondacija podržava razvoj lokalnih zajednica i civilnog društva u zemljama Zapadnog Balkana kroz grantove i programe jačanja kapaciteta.',
      website: 'https://www.tragfondacija.org',
      kategorija: 'Fondacija',
      boja: 'linear-gradient(135deg,#e67e22,#f39c12)',
      logoUrl: 'https://logo.clearbit.com/tragfondacija.org'
    },
    {
      naziv: 'CEMI',
      kratko: 'CE',
      opis: 'Centar za monitoring i istraživanje (CEMI) promoviše demokratske vrijednosti, vladavinu prava i transparentnost kroz istraživanje i građansko obrazovanje.',
      website: 'https://www.cemi.org.me',
      kategorija: 'Nevladina organizacija',
      boja: 'linear-gradient(135deg,#8e44ad,#9b59b6)',
      logoUrl: 'https://logo.clearbit.com/cemi.org.me'
    }
  ];
}