import { Component, computed, input } from '@angular/core';
import { Product } from '@products/interfaces/product-response';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './product-table.component.html',
  styles: ``
})
export class ProductTableComponent {

  products = input.required<Product[] | undefined>();

  getProductStockClass(product: Product) {
    if ( product.stock <= 10 ) return "badge badge-error";
    if ( product.stock <= 20 ) return "badge badge-warning";
    return "badge badge-success";
  }
}
