import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product-response';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options } from './interfaces/options';
import { User } from '@auth/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private productListCache = new Map<string, ProductsResponse>();

  private productCache = new Map<string, Product>();



  constructor() { }

  getProducts(options: Options): Observable<ProductsResponse> {
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
    if (idSlug === "new") {
      return of(this.getNewProduct());
    }
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

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${environment.API}/products/${id}`, product)
    .pipe(
      tap( product => this.updateProductCache(id, product))
    );
  }

  updateProductCache(id:string, product: Product) {
    this.productCache.set(id, product);
    this.productListCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(currenProd => currenProd.id === id ? product: currenProd);
    });
  }

  createProduct(productLike: Partial<Product>):Observable<Product> {
    return this.http.post<Product>(`${environment.API}/products`, productLike)
    .pipe(
      tap( product => this.updateProductCache(product.id, product))
    );
  }

  private getNewProduct() {
    const newProduct: Product = {
      id: 'new',
      title: '',
      price: 0,
      description: '',
      slug: '',
      stock: 0,
      sizes: [],
      gender: Gender.Men,
      tags: [],
      images: [],
      user: {} as User
    };
    return newProduct;
  }
}
