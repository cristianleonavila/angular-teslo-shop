import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {

  transform(value: string | string[]): string {
    const api = environment.API;
    if (typeof value === 'string') {
      return `${api}/files/product/${value}`;
    }
    const image = value.at(0);
    return !image ? './assets/images/no-image.jpg' : `${api}/files/product/${image}`;
  }

}
