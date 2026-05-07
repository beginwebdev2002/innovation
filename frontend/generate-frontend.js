const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
    const fullPath = path.join(__dirname, 'src', 'app', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
};

const writeRoot = (filepath, content) => {
    const fullPath = path.join(__dirname, 'src', filepath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
};

// ========================
// SHARED
// ========================
write('shared/api/api.service.ts', `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../config/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  
  get(url: string, params?: any) { return this.http.get(\`\${environment.apiUrl}/\${url}\`, { params }); }
  post(url: string, body: any) { return this.http.post(\`\${environment.apiUrl}/\${url}\`, body); }
  put(url: string, body: any) { return this.http.put(\`\${environment.apiUrl}/\${url}\`, body); }
  delete(url: string) { return this.http.delete(\`\${environment.apiUrl}/\${url}\`); }
}
`);

write('shared/config/environment.ts', `export const environment = {
  apiUrl: 'http://localhost:3000'
};
`);

write('shared/interceptors/auth.interceptor.ts', `import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: \`Bearer \${token}\` }
    });
  }
  return next(req);
};
`);

// ========================
// ENTITIES
// ========================
write('entities/user/user.store.ts', `import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, { user, isLoggedIn: !!user });
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      patchState(store, { user: null, isLoggedIn: false });
    }
  }))
);
`);

// ========================
// FEATURES
// ========================
write('features/auth/auth.service.ts', `import { Injectable, inject } from '@angular/core';
import { ApiService } from '@shared/api/api.service';
import { UserStore } from '@entities/user/user.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private userStore = inject(UserStore);

  login(credentials: any) {
    return this.api.post('auth/login', credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.userStore.setUser(res.user);
      })
    );
  }

  register(data: any) {
    return this.api.post('auth/register', data).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.userStore.setUser(res.user);
      })
    );
  }

  getProfile() {
    return this.api.get('auth/me').pipe(
      tap((user: any) => this.userStore.setUser(user))
    );
  }
}
`);

// ========================
// WIDGETS
// ========================
write('widgets/header/header.component.ts', `import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '@entities/user/user.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: \`
    <header class="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
      <a routerLink="/" class="text-xl font-bold text-white hover:text-gray-300">Мини Магазин</a>
      <nav class="flex gap-4 items-center">
        <a routerLink="/" class="hover:text-blue-400">Товары</a>
        @if (userStore.isLoggedIn()) {
          <a routerLink="/cart" class="hover:text-blue-400">Корзина</a>
          @if (userStore.user()?.role === 'admin') {
            <a routerLink="/admin" class="hover:text-red-400 font-bold border border-red-400 px-2 rounded">Admin Panel</a>
          }
          <button (click)="logout()" class="hover:text-red-400">Выйти</button>
        } @else {
          <a routerLink="/login" class="hover:text-blue-400">Вход</a>
        }
      </nav>
    </header>
  \`
})
export class HeaderComponent {
  userStore = inject(UserStore);
  
  logout() {
    this.userStore.logout();
  }
}
`);

// ========================
// PAGES
// ========================
write('pages/login/login.component.ts', `import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@features/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="flex items-center justify-center min-h-[80vh]">
      <div class="bg-white p-8 rounded shadow-md w-96 text-black">
        <h2 class="text-2xl font-bold mb-4">Вход</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" class="w-full border p-2 rounded" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Пароль</label>
            <input type="password" [(ngModel)]="password" name="password" class="w-full border p-2 rounded" required />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Войти</button>
        </form>
      </div>
    </div>
  \`
})
export class LoginComponent {
  email = '';
  password = '';
  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => alert('Ошибка входа')
    });
  }
}
`);

write('pages/home/home.component.ts', `import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@shared/api/api.service';
import { UserStore } from '@entities/user/user.store';

@Component({
  standalone: true,
  template: \`
    <div class="p-8 text-black">
      <h1 class="text-3xl font-bold mb-6">Каталог товаров</h1>
      
      <div class="flex gap-4 mb-6">
        <input type="text" placeholder="Поиск по названию..." [value]="search()" (input)="updateSearch($event)" class="border p-2 rounded" />
        <button (click)="loadProducts()" class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Найти</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (product of products(); track product.id) {
          <div class="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col">
            <h3 class="font-bold text-lg">{{product.name}}</h3>
            <p class="text-gray-600 flex-grow">{{product.description}}</p>
            <p class="text-xl font-bold my-2">\${{product.price}}</p>
            @if (userStore.isLoggedIn()) {
              <button (click)="addToCart(product.id)" class="bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600 transition">В корзину</button>
            }
          </div>
        }
      </div>
    </div>
  \`
})
export class HomeComponent implements OnInit {
  api = inject(ApiService);
  userStore = inject(UserStore);
  
  products = signal<any[]>([]);
  search = signal('');

  ngOnInit() {
    this.loadProducts();
  }

  updateSearch(e: any) { this.search.set(e.target.value); }

  loadProducts() {
    this.api.get('products', { search: this.search() }).subscribe((data: any) => this.products.set(data));
  }

  addToCart(productId: number) {
    this.api.post('cart', { productId, quantity: 1 }).subscribe(() => {
      alert('Добавлено в корзину');
    });
  }
}
`);

write('pages/cart/cart.component.ts', `import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@shared/api/api.service';

@Component({
  standalone: true,
  template: \`
    <div class="p-8 text-black">
      <h1 class="text-3xl font-bold mb-6">Корзина</h1>
      @if (cart().length === 0) {
        <p>Корзина пуста</p>
      } @else {
        <div class="flex flex-col gap-4">
          @for (item of cart(); track item.id) {
            <div class="flex justify-between items-center border p-4 rounded shadow">
              <div>
                <h3 class="font-bold">{{item.product.name}}</h3>
                <p>Количество: {{item.quantity}}</p>
              </div>
              <div class="flex items-center gap-4">
                <p class="font-bold">\${{item.product.price * item.quantity}}</p>
                <button (click)="removeItem(item.productId)" class="text-red-500 hover:text-red-700">Удалить</button>
              </div>
            </div>
          }
          
          <button (click)="checkout()" class="bg-green-500 text-white p-3 rounded mt-4 hover:bg-green-600 self-end">Оформить заказ</button>
        </div>
      }
    </div>
  \`
})
export class CartComponent implements OnInit {
  api = inject(ApiService);
  cart = signal<any[]>([]);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.api.get('cart').subscribe((data: any) => this.cart.set(data));
  }

  removeItem(productId: number) {
    this.api.delete(\`cart/\${productId}\`).subscribe(() => this.loadCart());
  }

  checkout() {
    this.api.post('orders/checkout', {}).subscribe({
      next: () => {
        alert('Заказ успешно оформлен!');
        this.loadCart();
      },
      error: () => alert('Ошибка при оформлении заказа')
    });
  }
}
`);

write('pages/admin/admin.component.ts', `import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '@shared/api/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="p-8 text-black">
      <h1 class="text-3xl font-bold mb-6 text-red-600">Админ Панель</h1>
      
      <div class="bg-gray-100 p-4 rounded mb-8">
        <h2 class="text-xl font-bold mb-4">Добавить новый товар</h2>
        <div class="flex gap-4">
          <input [(ngModel)]="newProduct.name" placeholder="Название" class="border p-2 flex-1 rounded" />
          <input [(ngModel)]="newProduct.description" placeholder="Описание" class="border p-2 flex-1 rounded" />
          <input [(ngModel)]="newProduct.price" type="number" placeholder="Цена" class="border p-2 w-32 rounded" />
          <button (click)="addProduct()" class="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">Добавить</button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        @for (product of products(); track product.id) {
          <div class="flex justify-between items-center border p-4 rounded shadow">
            <div>
              <p class="font-bold">{{product.name}}</p>
              <p class="text-sm text-gray-600">{{product.description}} - \${{product.price}}</p>
            </div>
            <button (click)="removeProduct(product.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Удалить</button>
          </div>
        }
      </div>
    </div>
  \`
})
export class AdminComponent implements OnInit {
  api = inject(ApiService);
  products = signal<any[]>([]);
  
  newProduct = { name: '', description: '', price: 0 };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.get('products').subscribe((data: any) => this.products.set(data));
  }

  addProduct() {
    this.api.post('products', this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = { name: '', description: '', price: 0 };
    });
  }

  removeProduct(id: number) {
    this.api.delete(\`products/\${id}\`).subscribe(() => this.loadProducts());
  }
}
`);

// ========================
// APP ROUTING & COMPONENT
// ========================
writeRoot('app.routes.ts', `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },
];
`);

writeRoot('app.component.ts', `import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@widgets/header/header.component';
import { AuthService } from '@features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: \`
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
      <app-header />
      <main class="flex-grow flex flex-col container mx-auto">
        <router-outlet />
      </main>
    </div>
  \`
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  
  ngOnInit() {
    if (localStorage.getItem('access_token')) {
      this.authService.getProfile().subscribe({
        error: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      });
    }
  }
}
`);

writeRoot('app.config.ts', `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '@shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
`);

console.log("Frontend FSD scaffolded successfully.");
