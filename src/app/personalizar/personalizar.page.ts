import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppStorageService } from '../services/app-storage.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Produto } from '../services/product.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  public hasImagem: boolean = false;
  public textoPersonalizacao: string = '';
  public tamanhoTexto: number = 24;
  public produto: Produto | null = null;

  constructor(
    private storageService: AppStorageService,
    private router: Router,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  private atualizarImagem(value: string | null) {
    this.imagemEstampa = value;
    this.hasImagem = !!value && value.trim().length > 0;
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const p = this.productService.getById(id);
      if (p) this.produto = p;
    }

    const designId = this.route.snapshot.queryParamMap.get('designId');
    if (designId) {
      const guardados = await this.storageService.get<any[]>('guardados') || [];
      const design = guardados.find(item => item.id === designId);
      if (design) {
        this.atualizarImagem(design.imagem || null);
        this.textoPersonalizacao = design.texto || '';
        this.tamanhoTexto = design.tamanhoTexto || 24;
        this.corTshirt = design.cor || '#ffffff';
        if (design.produto) {
          this.produto = design.produto;
        }
      }
    }
  }

  upload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.atualizarImagem(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async tirarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        this.atualizarImagem(image.dataUrl);
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Não foi possível capturar a foto.',
          duration: 2000,
          color: 'warning'
        });
        toast.present();
      }
    } catch (error) {
      console.error('Erro ao abrir câmera', error);
      const toast = await this.toastCtrl.create({
        message: 'Não foi possível abrir a câmera.',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
    }
  }

  async guardarPersonalizacao() {
    const guardados = await this.storageService.get<any[]>('guardados') || [];

    guardados.unshift({
      id: Date.now().toString(),
      imagem: this.imagemEstampa,
      texto: this.textoPersonalizacao,
      tamanhoTexto: this.tamanhoTexto,
      cor: this.corTshirt,
      produto: this.produto ? { ...this.produto } : null,
      criadoEm: new Date().toISOString()
    });

    await this.storageService.set('guardados', guardados);

    const toast = await this.toastCtrl.create({
      message: 'Personalização guardada para usar depois!',
      duration: 2000,
      color: 'success'
    });
    toast.present();
    this.router.navigate(['/guardados']);
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
      cor: this.corTshirt === '#ffffff' ? 'Branco' : this.corTshirt === '#1a1a1a' ? 'Preto' : 'Cinza',
      quantidade: 1,
      texto: this.textoPersonalizacao,
      tamanhoTexto: this.tamanhoTexto
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