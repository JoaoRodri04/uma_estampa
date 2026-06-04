import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {
  public produtos: any[] = [];
  public produtosFiltrados: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('assets/data/produtos.json').subscribe(data => {
      this.produtos = data;
      this.produtosFiltrados = data;
    });
  }

  filtrarProdutos(event: any) {
    const val = event.target.value.toLowerCase();
    if (val && val.trim() !== '') {
      this.produtosFiltrados = this.produtos.filter(p => p.nome.toLowerCase().indexOf(val) > -1);
    } else {
      this.produtosFiltrados = this.produtos;
    }
  }
}