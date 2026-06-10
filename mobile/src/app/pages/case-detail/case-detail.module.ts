import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CaseDetailPageRoutingModule } from './case-detail-routing.module';
import { CaseDetailPage } from './case-detail.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, CaseDetailPageRoutingModule],
  declarations: [CaseDetailPage],
})
export class CaseDetailPageModule {}
