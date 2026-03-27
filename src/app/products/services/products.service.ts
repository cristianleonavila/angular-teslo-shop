import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product-response';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

  updateProduct(id: string, product: Partial<Product>, images?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];
    return this.uploadImages(images).pipe(
      map(imagesNames => ({
        ...product,
        images: [...currentImages, ...imagesNames]
      })),
      switchMap(
        updatedProduct => this.http.patch<Product>(`${environment.API}/products/${id}`, updatedProduct)
      ),
      tap( product => this.updateProductCache(id, product))
    );
  }

  updateProductCache(id:string, product: Product) {
    this.productCache.set(id, product);
    this.productListCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(currenProd => currenProd.id === id ? product: currenProd);
    });
  }

  createProduct(productLike: Partial<Product>, images?: FileList):Observable<Product> {
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

  uploadImages(images?: FileList):Observable<string[]> {
    if ( !images ) return of([]);
    const uploadObservables = Array.from( images ).map(imageFile => this.uploadImage(imageFile));
    return forkJoin(uploadObservables).pipe(
      tap(images => console.log(images))
    );
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<{fileName: string}>(`${environment.API}/files/product`, formData)
    .pipe(
      map(respose => respose.fileName)
    );
  }
}
