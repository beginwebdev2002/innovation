import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('@pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('@pages/admin/admin.component').then(m => m.AdminComponent)
  },
];
