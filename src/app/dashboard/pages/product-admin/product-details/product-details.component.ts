import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@products/interfaces/product-response';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styles: ``
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  sizes = Object.values(Size);

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    tags: [['']],
    sizes: [['']],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  });

  onSubmit() {
    console.log(this.productForm.value);

  }

  ngOnInit(): void {
    this.productForm.reset(this.product() as any);
  }

  setFormValue( formLike: Partial<Product>) {
    this.productForm.patchValue(formLike as any);
  }

}
