import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./dashboard/dashboard.routes')
  },
  {
    path: '',
    loadChildren: () => import('./front/front-routes')
  }
];
