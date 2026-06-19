import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-slucajevi-pomoci',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './slucajevi-pomoci.component.html',
  styleUrls: ['./slucajevi-pomoci.component.scss']
})
export class SlucajeviPomociComponent implements OnInit {
  logoPath      = 'assets/logoFinally.jpg';
  logoWhitePath = 'assets/logoFinally.jpg';

  cards: any[] = [];
  selectedIndex: number | null = null;

  get selectedCard(): any | null {
    return this.selectedIndex !== null ? this.cards[this.selectedIndex] : null;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/pomogli-slucajevi').subscribe({
      next: (data) => { this.cards = data; }
    });
  }

  select(i: number) {
    this.selectedIndex = this.selectedIndex === i ? null : i;
  }

  zatvori() { this.selectedIndex = null; }
}
