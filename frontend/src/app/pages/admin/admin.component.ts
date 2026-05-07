import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '@shared/api/api.service';
import { FormsModule } from '@angular/forms';
import { environment } from '@shared/config/environment';

@Component({
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  api = inject(ApiService);
  products = signal<any[]>([]);
  apiUrl = environment.apiUrl;

  newProduct = { name: '', description: '', price: 0, category: '' };
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

  addProduct() {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('price', String(this.newProduct.price));
    if (this.newProduct.category) {
      formData.append('category', this.newProduct.category);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    this.api.postForm('products', formData).subscribe(() => {
      this.loadProducts();
      this.newProduct = { name: '', description: '', price: 0, category: '' };
      this.selectedFile = null;
      this.previewUrl = null;
    });
  }

  removeProduct(id: number) {
    this.api.delete(`products/${id}`).subscribe(() => this.loadProducts());
  }
}
