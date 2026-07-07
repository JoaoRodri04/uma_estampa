import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'carrinho',
    loadChildren: () => import('./carrinho/carrinho.module').then( m => m.CarrinhoPageModule)
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./catalogo/catalogo.module').then( m => m.CatalogoPageModule)
  },
  {
    path: 'conta',
    loadChildren: () => import('./conta/conta.module').then( m => m.ContaPageModule)
  },
  {
    path: 'encomenda',
    loadChildren: () => import('./encomenda/encomenda.module').then( m => m.EncomendaPageModule)
  },
  {
    path: 'personalizar',
    loadChildren: () => import('./personalizar/personalizar.module').then( m => m.PersonalizarPageModule)
  },
  {
    path: 'personalizar/:id',
    loadChildren: () => import('./personalizar/personalizar.module').then( m => m.PersonalizarPageModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./sobre/sobre.module').then( m => m.SobrePageModule)
  },
  {
    path: 'produto-detalhe',
    loadChildren: () => import('./produto-detalhe/produto-detalhe.module').then( m => m.ProdutoDetalhePageModule)
  },
  {
    path: 'meus-designs',
    loadChildren: () => import('./meus-designs/meus-designs.module').then( m => m.MeusDesignsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
