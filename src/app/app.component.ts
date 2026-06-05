/*import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}*/

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent], 
  template: `
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent {}
