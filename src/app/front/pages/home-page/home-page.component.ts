import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@share/pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PaginationService } from '@share/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  private productService = inject(ProductsService);
  pagination = inject(PaginationService);

  productsResource = rxResource({
    request: () => ({page: this.pagination.currentPage() - 1}),
    loader: ({ request }) => {
      console.log(request);

      return this.productService.getProducts({
        offset: request.page * 9
      });
    }
  });

}
