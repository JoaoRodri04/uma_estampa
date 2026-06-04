import { Component } from '@angular/core';
import { ProductService, Produto } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public produtos: Produto[] = [];

  constructor(private productService: ProductService) {
    this.produtos = this.productService.getAll();
  }
}
