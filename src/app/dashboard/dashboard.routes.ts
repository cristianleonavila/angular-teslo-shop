import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ProductListAdminComponent } from './pages/product-list-admin/product-list-admin.component';
import { ProductAdminComponent } from './pages/product-admin/product-admin.component';
import { isAdminGuard } from '@auth/guards/is-admin.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canMatch: [isAdminGuard],
    children: [
      {
        path: 'products',
        component: ProductListAdminComponent
      },
      {
        path: 'products/:id',
        component: ProductAdminComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  }
];


export default dashboardRoutes;
