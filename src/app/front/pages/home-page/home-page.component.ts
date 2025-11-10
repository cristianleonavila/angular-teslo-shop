import { Component } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
