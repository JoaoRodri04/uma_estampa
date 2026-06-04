import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppStorageService } from '../services/app-storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './produto-detalhe.page.html',
  styleUrls: ['./produto-detalhe.page.scss'],
})
export class ProdutoDetalhePage implements OnInit {
  public produto: any;
  public tamanho: string = 'M';
  public cor: string = 'Branco';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private storageService: AppStorageService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.http.get<any[]>('assets/data/produtos.json').subscribe(produtos => {
        this.produto = produtos.find(p => p.id == id);
      });
    });
  }

  async adicionarAoCarrinho() {
    const cart = await this.storageService.get<any[]>('carrinho') || []; 
    cart.push({
      produto: this.produto,
      tamanho: this.tamanho,
      cor: this.cor,
      quantidade: 1
    });
    await this.storageService.set('carrinho', cart);

    const toast = await this.toastCtrl.create({
      message: 'Adicionado ao carrinho!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    this.router.navigate(['/carrinho']);
  }
}