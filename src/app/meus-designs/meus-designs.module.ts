import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDesignsPageRoutingModule } from './meus-designs-routing.module';

import { MeusDesignsPage } from './meus-designs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeusDesignsPageRoutingModule
  ],
  declarations: [MeusDesignsPage]
})
export class MeusDesignsPageModule {}
