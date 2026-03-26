import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';

import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'app-product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.css'
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {

  images = input.required<string[]>();

  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper:Swiper|undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['images'].firstChange ) {
      return;
    }
    if ( !this.swiper ) return;
    this.swiper.destroy(true, true);
    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;

    if (!element) return;
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      modules: [Pagination, Navigation],
      loop: true,
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

}
