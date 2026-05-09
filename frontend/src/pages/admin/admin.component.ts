import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '@shared/api/api.service';
import { FormsModule } from '@angular/forms';
import { environment } from '@shared/config/environment';
import { ProductsFormComponent } from "@features/products";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, ProductsFormComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  api = inject(ApiService);
  products = signal<any[]>([]);
  apiUrl = environment.apiUrl;

  // Режим: 'create' | 'edit'
  mode: 'create' | 'edit' = 'create';
  editingProductId: number | null = null;

  productForm = { name: '', description: '', price: 0, category: '' };
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.get('products').subscribe((data: any) => this.products.set(data));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrl = e.target?.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  startEdit(product: any) {
    this.mode = 'edit';
    this.editingProductId = product.id;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category ?? '',
    };
    this.selectedFile = null;
    this.previewUrl = product.imageUrl ? this.apiUrl + product.imageUrl : null;
  }

  cancelEdit() {
    this.mode = 'create';
    this.editingProductId = null;
    this.productForm = { name: '', description: '', price: 0, category: '' };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  saveProduct() {
    if (this.mode === 'edit' && this.editingProductId !== null) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description);
    formData.append('price', String(this.productForm.price));
    if (this.productForm.category) {
      formData.append('category', this.productForm.category);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.api.postForm('products', formData).subscribe(() => {
      this.loadProducts();
      this.cancelEdit();
    });
  }

  updateProduct() {
    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description);
    formData.append('price', String(this.productForm.price));
    if (this.productForm.category) {
      formData.append('category', this.productForm.category);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.api.putForm(`products/${this.editingProductId}`, formData).subscribe(() => {
      this.loadProducts();
      this.cancelEdit();
    });
  }

  removeProduct(id: number) {
    this.api.delete(`products/${id}`).subscribe(() => this.loadProducts());
  }
}
