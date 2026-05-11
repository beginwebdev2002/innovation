import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Product, ProductsApiService, PRODUCT_CATEGORIES } from '@features/products';
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
  category = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  categories = signal<string[]>(PRODUCT_CATEGORIES);

  ngOnInit() {
    this.loadProducts();
  }

  updateSearch(e: Event) { this.search.set((e.target as HTMLInputElement).value); }
  updateCategory(e: Event) { this.category.set((e.target as HTMLInputElement).value); }
  updateMinPrice(e: Event) { 
    const val = (e.target as HTMLInputElement).value;
    this.minPrice.set(val ? Number(val) : null); 
  }
  updateMaxPrice(e: Event) { 
    const val = (e.target as HTMLInputElement).value;
    this.maxPrice.set(val ? Number(val) : null); 
  }

  loadProducts() {
    const params: Record<string, string | number> = {};
    if (this.search()) params['search'] = this.search();
    if (this.category()) params['category'] = this.category();
    if (this.minPrice() !== null) params['minPrice'] = this.minPrice()!;
    if (this.maxPrice() !== null) params['maxPrice'] = this.maxPrice()!;

    this.productsService.get('products', params)
    .subscribe((data: Product[]) => this.products.set(data));
  }

  addToCart(productId: number) {
    this.cartService.post(this.cartEndpoint(), { productId, quantity: 1 })
    .subscribe(() => {
      alert('Добавлено в корзину');
    });
  }
}
