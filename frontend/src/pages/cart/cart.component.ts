import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '@features/cart';
import { apiUrlMaker } from '@shared/utils';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe],
  providers: [CartService],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  cart = signal<any[]>([]);
  private getCartEndpoint = signal(apiUrlMaker('cart').href);
  private checkoutEndpoint = signal(apiUrlMaker('orders/checkout').href);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.get(this.getCartEndpoint()).subscribe((data: any[]) => this.cart.set(data));
  }

  removeItem(productId: number) {
    this.cartService.delete(this.removeCartEndpoint(productId)).subscribe(() => this.loadCart());
  }

  checkout() {
    this.cartService.post(this.checkoutEndpoint(), {}).subscribe({
      next: () => {
        alert('Заказ успешно оформлен!');
        this.loadCart();
      },
      error: () => alert('Ошибка при оформлении заказа')
    });
  }
  private removeCartEndpoint(productId: number) {
    return apiUrlMaker(`cart/${productId}`).href;
  }
}
