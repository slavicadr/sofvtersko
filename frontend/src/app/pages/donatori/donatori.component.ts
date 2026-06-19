import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-donatori',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './donatori.component.html',
  styleUrls: ['./donatori.component.scss']
})
export class DonatorComponent implements OnInit {
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  donatori: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/partneri').subscribe({
      next: (data) => { this.donatori = data; }
    });
  }

  onLogoError(event: Event, boja: string, kratko: string) {
    const img = event.target as HTMLImageElement;
    const circle = img.parentElement!;
    img.style.display = 'none';
    circle.style.background = boja || 'linear-gradient(135deg,#2d6b55,#7ab648)';
    circle.innerHTML = `<span class="logo-fallback-text">${kratko || '?'}</span>`;
  }
}
