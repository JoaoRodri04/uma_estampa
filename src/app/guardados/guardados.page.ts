import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppStorageService } from '../services/app-storage.service';

@Component({
  selector: 'app-guardados',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './guardados.page.html',
  styleUrls: ['./guardados.page.scss'],
})
export class GuardadosPage implements OnInit {
  public designs: any[] = [];

  constructor(
    private storageService: AppStorageService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.carregar();
  }

  async carregar() {
    this.designs = await this.storageService.get<any[]>('guardados') || [];
  }

  abrirDesign(design: any) {
    this.router.navigate(['/personalizar'], { queryParams: { designId: design.id } });
  }

  async removerDesign(id: string) {
    this.designs = this.designs.filter(item => item.id !== id);
    await this.storageService.set('guardados', this.designs);

    const toast = await this.toastCtrl.create({
      message: 'Personalização removida.',
      duration: 1500,
      color: 'warning'
    });
    toast.present();
  }
}
