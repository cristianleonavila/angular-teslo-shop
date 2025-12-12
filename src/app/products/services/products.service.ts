import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, ProductsResponse } from '@products/interfaces/product-response';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options } from './interfaces/options';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private productListCache = new Map<string, ProductsResponse>();

  private productCache = new Map<string, Product>();

  constructor() { }

  getProducts(options: Options): Observable<ProductsResponse> {
    console.log(options);
    const { limit = 9, offset = 0, gender = ''} = options;
    const key = `${limit}-${offset}-${gender}`;

    if ( this.productListCache.has(key) ) {
      return of(this.productListCache.get(key)!);
    }
    return this.http.get<ProductsResponse>(`${environment.API}/products`, {
      params: { limit, gender, offset }
    })
    .pipe(
      tap(console.log),
      tap((resp) => this.productListCache.set(key, resp))
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if ( this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${environment.API}/products/${idSlug}`)
    .pipe(
      delay(2000),
      tap(console.log),
      tap((resp) => this.productCache.set(idSlug, resp))
    );
  }
}
