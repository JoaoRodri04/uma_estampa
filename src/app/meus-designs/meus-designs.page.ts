import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';

export interface Design {
  id: string;
  nome: string;
  cor: string;
  imagemEstampa: string | null;
  produtoBase: string;
  tamanho: string;
  preco: number;
  dataCriacao: string;
  encomendado: boolean;
}

@Component({
  selector: 'app-meus-designs',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './meus-designs.page.html',
  styleUrls: ['./meus-designs.page.scss'],
})
export class MeusDesignsPage implements OnInit {
  public designs: Design[] = [];

  constructor(
    private storageService: AppStorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.carregarDesigns();
  }

  async carregarDesigns() {
    const designs = await this.storageService.get<Design[]>('meus_designs');
    this.designs = designs || [];
  }

  async adicionarAoCarrinho(design: Design) {
    const carrinho = await this.storageService.get<any[]>('carrinho') || [];

    carrinho.push({
      produto: {
        id: design.id,
        nome: design.nome,
        preco: design.preco,
        imagem: design.imagemEstampa || 'assets/images/mockup_blank.png',
        categoria: 'Exclusivo'
      },
      tamanho: design.tamanho,
      cor: design.cor,
      quantidade: 1
    });

    await this.storageService.set('carrinho', carrinho);

    const toast = await this.toastCtrl.create({
      message: `"${design.nome}" adicionado ao carrinho!`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async confirmarEliminar(design: Design) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Design',
      message: `Tens a certeza que queres eliminar "${design.nome}"? Esta ação não pode ser revertida.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarDesign(design)
        }
      ]
    });
    await alert.present();
  }

  async eliminarDesign(design: Design) {
    this.designs = this.designs.filter(d => d.id !== design.id);
    await this.storageService.set('meus_designs', this.designs);

    const toast = await this.toastCtrl.create({
      message: 'Design eliminado.',
      duration: 2000,
      color: 'medium',
      position: 'bottom'
    });
    await toast.present();
  }

  getCorLabel(hex: string): string {
    const cores: Record<string, string> = {
      '#ffffff': 'Branco',
      '#1a1a1a': 'Preto',
      '#b0b0b0': 'Cinza'
    };
    return cores[hex] || hex;
  }

  trackById(_: number, d: Design) {
    return d.id;
  }
}
