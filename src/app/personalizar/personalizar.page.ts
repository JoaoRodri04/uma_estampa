import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Produto } from '../services/product.service';
import { Design } from '../meus-designs/meus-designs.page';

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
  public nomeDesign: string = '';
  public tamanho: string = 'L';

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

  private getCorLabel(hex: string): string {
    const cores: Record<string, string> = {
      '#ffffff': 'Branco',
      '#1a1a1a': 'Preto',
      '#b0b0b0': 'Cinza'
    };
    return cores[hex] || hex;
  }

  async salvar() {
    const baseProduct = this.produto ? this.produto : {
      id: 'customizado',
      nome: 'T-shirt Personalizada',
      preco: 25.00,
      imagem: this.imagemEstampa || 'assets/images/mockup_blank.png',
      categoria: 'Exclusivo'
    };

    const designNome = this.nomeDesign.trim() || baseProduct.nome;
    const designId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Adiciona apenas ao carrinho
    const cart = await this.storageService.get<any[]>('carrinho') || [];
    cart.push({
      produto: {
        id: designId,
        nome: designNome,
        preco: baseProduct.preco,
        imagem: this.imagemEstampa || baseProduct.imagem,
        categoria: 'Exclusivo'
      },
      tamanho: this.tamanho,
      cor: this.getCorLabel(this.corTshirt),
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

  async guardarApenas() {
    const baseProduct = this.produto ? this.produto : {
      id: 'customizado',
      nome: 'T-shirt Personalizada',
      preco: 25.00,
      imagem: this.imagemEstampa || 'assets/images/mockup_blank.png',
      categoria: 'Exclusivo'
    };

    const designNome = this.nomeDesign.trim() || baseProduct.nome;
    const designId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const agora = new Date().toLocaleDateString('pt-PT', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const designs = await this.storageService.get<Design[]>('meus_designs') || [];
    const novoDesign: Design = {
      id: designId,
      nome: designNome,
      cor: this.corTshirt,
      imagemEstampa: this.imagemEstampa,
      produtoBase: baseProduct.nome,
      tamanho: this.tamanho,
      preco: baseProduct.preco,
      dataCriacao: agora,
      encomendado: false
    };
    designs.unshift(novoDesign);
    await this.storageService.set('meus_designs', designs);

    const toast = await this.toastCtrl.create({
      message: 'Design guardado em "Meus Designs"!',
      duration: 2500,
      color: 'success'
    });
    toast.present();
    this.router.navigate(['/meus-designs']);
  }
}
