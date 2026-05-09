import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductsFormComponent } from "@features/products";
import { ProductsApiService } from '@features/products/api/products-api.service';
import { ProductsListComponent } from '@features/products/ui/products-list/products-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  providers: [ProductsApiService],
  imports: [FormsModule, ProductsFormComponent, ProductsListComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  editingProduct = signal<Product | null>(null);
  products = signal<Product[]>([]);

  private productsApiService = inject(ProductsApiService);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsApiService.get('products').subscribe((data: Product[]) => {
      this.products.set(data);
    });
  }

  onSaveProduct(formData: FormData) {
    this.productsApiService.post('products', formData)
    .subscribe((data: Product) => {
      this.updateAddState(data);
    });
  }

  onSaveEdittedProduct(formData: FormData) {
    const product = this.editingProduct();
    if (!product) return;
    this.productsApiService.put(`products/${product.id}`, formData)
    .subscribe((data: Product) => {
      this.updateEditState(data);
      this.editingProduct.set(null);
    });
  }

  onEditProduct(product: Product) {
    this.editingProduct.set(product);
  }

  onRemoveProduct(id: number) {
    this.productsApiService.delete(`products/${id}`)
    .subscribe((product: Product) => {
      this.updateDeleteState(product.id);
    });
  }
  private updateAddState(product: Product){
    this.products.update((products) => [...products, product]);
  }
  private updateEditState(product: Product) {
    this.products.update((products) => products.map((p) => p.id === product.id ? product : p));
  }
  private updateDeleteState(id: number) {
    this.products.update((products) => products.filter((product) => product.id !== id));
  }
}
