import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';

@Component({
  selector: 'app-encomenda',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './encomenda.page.html',
  styleUrls: ['./encomenda.page.scss'],
})
export class EncomendaPage implements OnInit {
  public dados = { nome: '', morada: '', cp: '' };
  public pagamento: string = 'mbway';

  constructor(private router: Router, private alertCtrl: AlertController, private storageService: AppStorageService) {}

  ngOnInit() {}

  async concluirPedido() {
    if (!this.dados.nome || !this.dados.morada || !this.dados.cp) {
      return;
    }
    await this.storageService.remove('carrinho');
    
    const alert = await this.alertCtrl.create({
      header: 'Sucesso!',
      message: 'Encomenda registada com sucesso.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/home']);
  }
}