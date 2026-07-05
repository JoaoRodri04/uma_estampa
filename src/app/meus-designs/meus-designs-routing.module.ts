import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDesignsPage } from './meus-designs.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDesignsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDesignsPageRoutingModule {}
