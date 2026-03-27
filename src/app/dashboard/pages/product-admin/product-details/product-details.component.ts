import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@products/interfaces/product-response';
import { FormUtils } from '@utils/form-utils';
import { FormErrorComponent } from "@share/form-error/form-error.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarouselComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './product-details.component.html',
  styles: ``
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  sizes = Object.values(Size);

  fb = inject(FormBuilder);

  service = inject(ProductsService);

  router = inject(Router);

  wasSaved = signal(false);

  imageFileList: FileList | undefined = undefined;

  tempImages = signal<string[]>([]);

  imagesToCarousel = computed(() => {
    return [
      ...this.product().images,
      ...this.tempImages()
    ];
  })

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    tags: [''],
    sizes: [['']],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  });

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if ( !isValid ) return;
    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.split(',').map(tag => tag.trim()) ?? []
    };

    if ( this.product().id === "new") {
      const producto = await firstValueFrom(
        this.service.createProduct(productLike, this.imageFileList)
      );
      this.router.navigate(['/admin/products', producto.id])
    } else {
      await firstValueFrom(
        this.service.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000)
  }

  ngOnInit(): void {
    this.setFormValue(this.product() as any);
  }

  setFormValue( formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(",") });
  }

  onSizeChange(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];
    if ( currentSizes.includes(size) ) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes});
  }

  onFilesChanged(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    this.imageFileList = files ?? undefined;
    const imageUrls = Array.from(files ?? []).map(file => URL.createObjectURL(file));
    this.tempImages.set(imageUrls);
  }

}
