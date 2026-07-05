import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';
import { Design } from '../meus-designs/meus-designs.page';

@Component({
  selector: 'app-encomenda',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './encomenda.page.html',
  styleUrls: ['./encomenda.page.scss'],
})
export class EncomendaPage implements OnInit {
  public dados = { nome: '', morada: '', cp: '', telemovel: '', email: '' };
  public pagamento: string = 'mbway';
  public itens: any[] = [];
  public precoTotal: number = 0;
  public taxaEntrega: number = 3.99;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private storageService: AppStorageService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    const cart = await this.storageService.get<any[]>('carrinho') || [];
    this.itens = cart;
    this.calcularTotal();
  }

  calcularTotal() {
    const subtotal = this.itens.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade, 0
    );
    this.precoTotal = subtotal + (this.itens.length > 0 ? this.taxaEntrega : 0);
  }

  get subtotal(): number {
    return this.itens.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade, 0
    );
  }

  get contactoValido(): boolean {
    return !!(this.dados.telemovel.trim() || this.dados.email.trim());
  }

  async concluirPedido() {
    if (!this.dados.nome || !this.dados.morada || !this.dados.cp) return;
    if (!this.contactoValido) return;

    // Marcar designs como encomendados
    const idsNoCarrinho = new Set(this.itens.map((item: any) => item.produto?.id));
    const designs = await this.storageService.get<Design[]>('meus_designs') || [];
    const designsAtualizados = designs.map(d => ({
      ...d,
      encomendado: d.encomendado || idsNoCarrinho.has(d.id)
    }));
    await this.storageService.set('meus_designs', designsAtualizados);
    await this.storageService.remove('carrinho');

    const alert = await this.alertCtrl.create({
      header: '✓ Encomenda Confirmada',
      message: `Obrigado, ${this.dados.nome}! Receberás a confirmação ${this.dados.email ? 'no email ' + this.dados.email : 'por SMS no ' + this.dados.telemovel}.`,
      buttons: [{ text: 'OK', handler: () => this.router.navigate(['/home']) }]
    });
    await alert.present();
  }
}
