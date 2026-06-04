import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Produto } from '../services/product.service';

@Component({
  selector: 'app-personalizar',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './personalizar.page.html',
  styleUrls: ['./personalizar.page.scss'],
})
export class PersonalizarPage implements OnInit {
  public corTshirt: string = '#ffffff';
  public imagemEstampa: string | null = null;
  public produto: Produto | null = null;

  constructor(
    private storageService: AppStorageService,
    private router: Router,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const p = this.productService.getById(id);
      if (p) this.produto = p;
    }
  }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagemEstampa = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async salvar() {
    const cart = await this.storageService.get<any[]>('carrinho') || [];
    const baseProduct = this.produto ? this.produto : {
      id: 'customizado',
      nome: 'T-shirt Personalizada',
      preco: 25.00,
      imagem: this.imagemEstampa || 'assets/images/mockup_blank.png',
      categoria: 'Exclusivo'
    };

    cart.push({
      produto: {
        ...baseProduct,
        imagem: this.imagemEstampa || baseProduct.imagem
      },
      tamanho: 'L',
      cor: this.corTshirt === '#ffffff' ? 'Branco' : 'Preto',
      quantidade: 1
    });
    await this.storageService.set('carrinho', cart);

    const toast = await this.toastCtrl.create({
      message: 'Design adicionado ao carrinho!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    this.router.navigate(['/carrinho']);
  }
}