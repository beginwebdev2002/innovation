import { Routes } from '@angular/router';
import { userGuard } from '@features/auth/guards/user.guard';
import { adminGuard } from '@features/auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'signin',
    loadComponent: () => import('@pages/signin/signin.component').then(m => m.SigninComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('@pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'cart',
    canActivate: [userGuard],
    loadComponent: () => import('@pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('@pages/admin/admin.component').then(m => m.AdminComponent)
  },
];
