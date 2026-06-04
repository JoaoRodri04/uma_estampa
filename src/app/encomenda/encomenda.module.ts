import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncomendaPageRoutingModule } from './encomenda-routing.module';

import { EncomendaPage } from './encomenda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncomendaPageRoutingModule,
    EncomendaPage
  ],
})
export class EncomendaPageModule {}
