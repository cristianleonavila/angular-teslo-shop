import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
  styleUrl: './gender-page.component.css'
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);

  private productService = inject(ProductsService);


  productsResource = rxResource({
    request: () => ({ gender: this.gender()}),
    loader: ({ request }) => {
      return this.productService.getProducts({gender: request.gender});
    }
  });

  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  );

}
