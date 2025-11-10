import { Routes } from '@angular/router';
import { FrontLayoutComponent } from './components/front-layout/front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GenderPageComponent } from './pages/gender-page/gender-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const frontRoutes: Routes = [
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'gender/:gender',
        component: GenderPageComponent
      },
      {
        path: 'product/:idSlug',
        component: ProductPageComponent
      },
      {
        path: '**',
        component: NotFoundPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export default frontRoutes;
