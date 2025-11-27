import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@share/pagination/pagination.component';
import { PaginationService } from '@share/pagination/pagination.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css'
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);

  private productService = inject(ProductsService);

  pagination = inject(PaginationService);

  productsResource = rxResource({
    request: () => ({ gender: this.gender(), page: this.pagination.currentPage() - 1}),
    loader: ({ request }) => {
      return this.productService.getProducts({gender: request.gender, offset: request.page * 9 });
    }
  });

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  );

}
