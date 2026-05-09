import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '@shared/api/api.service';
import { UserStore } from '@entities/user/user.store';
import { environment } from '@environments/environment';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  api = inject(ApiService);
  userStore = inject(UserStore);
  apiUrl = environment.apiUrl;

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
