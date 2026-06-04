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
      imagem: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '2',
      nome: 'Boné Clássico',
      preco: 29.90,
      categoria: 'Acessórios',
      imagem: 'https://images.unsplash.com/photo-1520975601212-0c53b69b96a5?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '3',
      nome: 'Mug Personalizado',
      preco: 24.90,
      categoria: 'Casa',
      imagem: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '4',
      nome: 'Regata Vintage',
      preco: 34.90,
      categoria: 'Vestuário',
      imagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '5',
      nome: 'Moletom com Capuz',
      preco: 59.90,
      categoria: 'Vestuário',
      imagem: 'https://images.unsplash.com/photo-1556821552-5f4c2f3a1c3a?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '6',
      nome: 'Saco de Pano',
      preco: 19.90,
      categoria: 'Acessórios',
      imagem: 'https://images.unsplash.com/photo-1544441894-5e9d8b5b5c1a?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '7',
      nome: 'Almofada Personalizada',
      preco: 44.90,
      categoria: 'Casa',
      imagem: 'https://images.unsplash.com/photo-1491684221066-81342ee5ff30?auto=format&fit=crop&w=900&q=80'
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
      nome: 'Camiseta Gráfica',
      preco: 42.90,
      categoria: 'Vestuário',
      imagem: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: '10',
      nome: 'Garrafas de Água',
      preco: 29.90,
      categoria: 'Casa',
      imagem: 'https://images.unsplash.com/photo-1602143407151-7e36dd0193d7?auto=format&fit=crop&w=900&q=80'
    }
  ];

  getAll(): Produto[] {
    return this.produtos;
  }

  getById(id: string): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }
}
