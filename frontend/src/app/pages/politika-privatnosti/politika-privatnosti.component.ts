import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-politika-privatnosti',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './politika-privatnosti.component.html',
  styleUrls: ['./politika-privatnosti.component.scss']
})
export class PolitikaPrivatnostiComponent {
  logoPath = 'assets/logoFinally.jpg';
}
