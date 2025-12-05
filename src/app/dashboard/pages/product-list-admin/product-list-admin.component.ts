import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@share/pagination/pagination.service';
import { PaginationComponent } from "@share/pagination/pagination.component";

@Component({
  selector: 'app-product-list-admin',
  imports: [ProductTableComponent, PaginationComponent],
  templateUrl: './product-list-admin.component.html',
  styles: ``
})
export class ProductListAdminComponent {

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
