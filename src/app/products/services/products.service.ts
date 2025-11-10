import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/interfaces/product-response';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Options } from './interfaces/options';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  constructor() { }

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = ''} = options;
    return this.http.get<ProductsResponse>(`${environment.API}/products`, {
      params: { limit, gender, offset }
    })
    .pipe(
      tap(console.log)
    );
  }
}
