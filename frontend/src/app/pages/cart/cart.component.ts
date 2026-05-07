import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '@shared/api/api.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart.component.html'
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
    this.api.delete(`cart/${productId}`).subscribe(() => this.loadCart());
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
