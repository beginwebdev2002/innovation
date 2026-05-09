import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { environment } from '@environments/environment';
import { Product } from '@features/products/models/products.model';

@Component({
  selector: 'app-products-list',
  imports: [CurrencyPipe],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  edit = output<Product>();
  remove = output<number>();
  readonly products = input.required<Product[]>();
  apiUrl = environment.apiUrl;

 startEdit(product: Product) {
    this.edit.emit(product);
    // this.editingProductId = product.id;
    // this.productForm = {
    //   name: product.name,
    //   description: product.description,
    //   price: product.price,
    //   category: product.category ?? '',
    // };
    // this.selectedFile = null;
    // this.previewUrl = product.imageUrl ? this.apiUrl + product.imageUrl : null;
  }


 

 

  onRemoveProduct(id: number) {
    this.remove.emit(id);
  }
}
