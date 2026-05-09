import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ProductsApiService } from '@features/products/api/products-api.service';
import { initialProductFormModel, ProductFormModel, productValidationSchema } from '@features/products/models/products.model';

@Component({
  selector: 'app-products-form',
  imports: [FormField],
  providers: [ProductsApiService],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFormComponent implements OnInit {
  mode = signal<'edit' | 'create'>('create');
  readonly productFormModel = signal<ProductFormModel>(initialProductFormModel);
  readonly productForm = form(this.productFormModel, productValidationSchema);
  private readonly productsApiService = inject(ProductsApiService);

  ngOnInit() {
    console.log(this.productForm().invalid());
    
  }

  saveProduct() {
    if (this.mode() === 'edit') {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct() {
    const formData = new FormData();
    formData.append('name', this.productFormModel().name);
    formData.append('description', this.productFormModel().description);
    formData.append('price', String(this.productFormModel().price));
    if (this.productFormModel().category) {
      formData.append('category', this.productFormModel().category);
    }
    if (this.productFormModel().image) {
      formData.append('image', this.productFormModel().image as File);
    }
    this.productsApiService.postForm('products', formData).subscribe(() => {
      this.loadProducts();
      this.cancelEdit();
    });
  }
  
  updateProduct() {}
   cancelEdit() {
    this.mode.set('create');
    this.productFormModel.set(initialProductFormModel);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        // @ts-ignore
        this.productFormModel.update(prev => ({ ...prev, image: file, imageUrl: url }));
      };
      reader.readAsDataURL(file);
    }
  }
  private loadProducts() {}
}
