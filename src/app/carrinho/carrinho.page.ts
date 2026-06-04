import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppStorageService } from '../services/app-storage.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {
  public itens: any[] = [];
  public precoTotal: number = 0;

  constructor(private storageService: AppStorageService) {}

  async ngOnInit() {
    await this.carregarCarrinho();
  }

  async ionViewWillEnter() {
    await this.carregarCarrinho();
  }

  async carregarCarrinho() {
    const cart = await this.storageService.get<any[]>('carrinho');
    this.itens = cart || [];
    this.calcularTotal();
  }

  calcularTotal() {
    this.precoTotal = this.itens.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);
  }

  async aumentarQtd(item: any) {
    item.quantidade++;
    await this.atualizarStorage();
  }

  async diminuirQtd(item: any) {
    if (item.quantidade > 1) {
      item.quantidade--;
      await this.atualizarStorage();
    }
  }

  async removerItem(item: any) {
    this.itens = this.itens.filter(i => i !== item);
    await this.atualizarStorage();
  }

  async atualizarStorage() {
    await this.storageService.set('carrinho', this.itens);
    this.calcularTotal();
  }
}