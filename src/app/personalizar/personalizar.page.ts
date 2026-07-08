import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('previewCanvas', { static: false }) previewCanvas!: ElementRef<HTMLCanvasElement>;

  public corTshirt = '#ffffff';
  public imagemEstampa: string | null = null;
  public imagemOriginal: string | null = null;
  public produto: Produto | null = null;
  public nomeDesign = '';
  public tamanho = 'L';
  public escala = 1;
  public posX = 0;
  public posY = 0;
  public tamanhoPreview = 220;
  public textoPersonalizado = '';
  public tamanhoTexto = 48;
  public corTexto = '#ffffff';
  public posTextoY = 70;

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
        this.imagemOriginal = e.target.result;
        this.imagemEstampa = e.target.result;
        this.escala = 1;
        this.posX = 0;
        this.posY = 0;
        this.renderPreview();
      };
      reader.readAsDataURL(file);
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = src;
    });
  }

  private calcularLayout(img: HTMLImageElement, viewportSize: number) {
    const aspect = img.naturalWidth / img.naturalHeight;
    const baseScale = Math.min(viewportSize / img.naturalWidth, viewportSize / img.naturalHeight);
    const scale = baseScale * this.escala;

    let drawWidth = img.naturalWidth * scale;
    let drawHeight = drawWidth / aspect;
    if (drawHeight < img.naturalHeight * scale) {
      drawHeight = img.naturalHeight * scale;
      drawWidth = drawHeight * aspect;
    }

    const maxOffsetX = Math.max(drawWidth - viewportSize, 0);
    const maxOffsetY = Math.max(drawHeight - viewportSize, 0);
    const offsetX = ((viewportSize - drawWidth) / 2) + (this.posX / 100) * maxOffsetX;
    const offsetY = ((viewportSize - drawHeight) / 2) + (this.posY / 100) * maxOffsetY;

    return { drawWidth, drawHeight, offsetX, offsetY };
  }

  async renderPreview() {
    const canvas = this.previewCanvas?.nativeElement;
    if (!canvas || !this.imagemOriginal) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const img = await this.loadImage(this.imagemOriginal);
      const size = this.tamanhoPreview;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, size, size);

      const { drawWidth, drawHeight, offsetX, offsetY } = this.calcularLayout(img, size);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, size, size);
      ctx.clip();
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      if (this.textoPersonalizado.trim()) {
        const fontSize = Math.max(20, this.tamanhoTexto);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = this.corTexto;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textY = (this.posTextoY / 100) * size;
        ctx.fillText(this.textoPersonalizado, size / 2, textY);
      }
    } catch (error) {
      console.error('Erro ao renderizar a pré-visualização', error);
    }
  }

  async aplicarEdicao() {
    if (!this.imagemOriginal) return;

    const canvas = document.createElement('canvas');
    const outputSize = 1000;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const img = await this.loadImage(this.imagemOriginal);
      const { drawWidth, drawHeight, offsetX, offsetY } = this.calcularLayout(img, outputSize);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, outputSize, outputSize);
      ctx.clip();
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      if (this.textoPersonalizado.trim()) {
        const fontSize = Math.max(20, this.tamanhoTexto * 2);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = this.corTexto;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textY = (this.posTextoY / 100) * outputSize;
        ctx.fillText(this.textoPersonalizado, outputSize / 2, textY);
      }

      this.imagemEstampa = canvas.toDataURL('image/png');
      await this.renderPreview();
    } catch (error) {
      console.error('Erro ao aplicar a edição da imagem', error);
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
