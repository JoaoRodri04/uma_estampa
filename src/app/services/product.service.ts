import { Injectable } from '@angular/core';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private produtos: Produto[] = [
    {
      id: '1',
      nome: 'Camiseta Branca',
      preco: 39.90,
      categoria: 'Vestuário',
      imagem: 'https://images.unsplash.com/photo-1651761179569-4ba2aa054997?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '2',
      nome: 'Boné Clássico',
      preco: 29.90,
      categoria: 'Acessórios',
      imagem: 'https://media.istockphoto.com/id/2220907733/pt/foto/isolated-plain-white-baseball-cap.webp?a=1&b=1&s=612x612&w=0&k=20&c=VFC00dVXfW1PI5i7yqi3iOmOJ8a_XwA60Ia0phYiSdk='
    },
    {
      id: '3',
      nome: 'Mug Personalizado',
      preco: 24.90,
      categoria: 'Casa',
      imagem: 'https://images.unsplash.com/photo-1650959858546-d09833d5317b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG11Z3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '4',
      nome: 'Regata Vintage',
      preco: 34.90,
      categoria: 'Vestuário',
      imagem: 'https://media.istockphoto.com/id/964763004/pt/foto/isolated-woman-black-vest.webp?a=1&b=1&s=612x612&w=0&k=20&c=wCO741SUWjDZRhv3A-nSTVF0KfZlGEGb2o9vwqZ0Psg='
    },
    {
      id: '5',
      nome: 'Sweat',
      preco: 59.90,
      categoria: 'Vestuário',
      imagem: 'https://media.istockphoto.com/id/1456814310/pt/foto/white-hoodie-back-mockup-on-light-wood-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=LC5zoxFBGS56IaB7qq-rP_Ah6B21Vn0CFd_JDVKydbQ='
    },
    {
      id: '6',
      nome: 'Saco de Pano',
      preco: 19.90,
      categoria: 'Acessórios',
      imagem: 'https://plus.unsplash.com/premium_photo-1681324227573-953664cf9b32?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2FjbyUyMHBhbm98ZW58MHx8MHx8fDA%3D'
    },
    {
      id: '7',
      nome: 'Almofada Personalizada',
      preco: 44.90,
      categoria: 'Casa',
      imagem: 'https://images.unsplash.com/photo-1691256676366-370303d55b61?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWxtb2ZhZGF8ZW58MHx8MHx8fDA%3D'
    },
    {
      id: '8',
      nome: 'Óculos de Sol',
      preco: 49.90,
      categoria: 'Acessórios',
      imagem: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '9',
      nome: 'Garrafas de Água',
      preco: 29.90,
      categoria: 'Casa',
      imagem: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FycmFmYXxlbnwwfHwwfHx8MA%3D%3D'
    }
  ];

  getAll(): Produto[] {
    return this.produtos;
  }

  getById(id: string): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }
}
