import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab4Page } from './tab4.page';
import { Tab4PageRoutingModule } from './tab4-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, Tab4PageRoutingModule],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
