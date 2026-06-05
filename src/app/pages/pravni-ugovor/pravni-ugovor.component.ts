import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-pravni-ugovor',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './pravni-ugovor.component.html',
  styleUrls: ['./pravni-ugovor.component.scss']
})
export class PravniUgovorComponent {
  logoPath = 'assets/logoFinally.jpg';
}
