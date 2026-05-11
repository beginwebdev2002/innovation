import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Product, ProductsApiService } from '@features/products';
import { CartService } from '@features/cart';
import { UserStore } from '@entities/user/user.store';
import { environment } from '@environments/environment';
import { apiUrlMaker } from '@shared/utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  providers: [ProductsApiService, CartService],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productsService = inject(ProductsApiService);
  private cartService = inject(CartService);
  userStore = inject(UserStore);
  private cartEndpoint = signal(apiUrlMaker('cart').href);
  apiUrl = signal(environment.apiUrl);

  products = signal<Product[]>([]);
  search = signal('');

  ngOnInit() {
    this.loadProducts();
  }

  updateSearch(e: Event) { this.search.set((e.target as HTMLInputElement).value); }

  loadProducts() {
    this.productsService.get('products', { search: this.search() })
    .subscribe((data: Product[]) => this.products.set(data));
  }

  addToCart(productId: number) {
    this.cartService.post(this.cartEndpoint(), { productId, quantity: 1 })
    .subscribe(() => {
      alert('Добавлено в корзину');
    });
  }
}
