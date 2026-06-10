import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  // Isti podaci kao na početnoj stranici
  aboutValues = [
    { icon:'ph-shield-check',       bg:'linear-gradient(135deg,#2d6b55,#3d8c6e)', title:'Povjerenje',  desc:'' },
    { icon:'ph-lock-simple',        bg:'linear-gradient(135deg,#1565c0,#1976d2)', title:'Sigurnost',   desc:'' },
    { icon:'ph-handshake',          bg:'linear-gradient(135deg,#7ab648,#5a9e28)', title:'Solidarnost', desc:'' },
    { icon:'ph-person-arms-spread', bg:'linear-gradient(135deg,#e67e22,#d35400)', title:'Inkluzija',   desc:'' },
  ];

  teamMembers = [
    { name:'Isidora Mujović',      role:'Developer', initials:'IM', bg:'linear-gradient(135deg,#a8ddd0,#c8ede4)' },
    { name:'Slavica Drobnjak',     role:'Developer', initials:'SD', bg:'linear-gradient(135deg,#b8e080,#d4f09a)' },
    { name:'Anastasija Bulatović', role:'Developer', initials:'AB', bg:'linear-gradient(135deg,#f0c89e,#fce0c0)' },
  ];
}
