import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-uslovi-koriscenja',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './uslovi-koriscenja.component.html',
  styleUrls: ['./uslovi-koriscenja.component.scss']
})
export class UsloviKoriscenjaComponent {
  logoPath = 'assets/logoFinally.jpg';
}
