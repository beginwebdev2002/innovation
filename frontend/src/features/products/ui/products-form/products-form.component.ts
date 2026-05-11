import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ProductsApiService } from '@features/products/api/products-api.service';
import { initialProductFormModel, Product, ProductFormModel, productValidationSchema, PRODUCT_CATEGORIES } from '@features/products/models/products.model';
import { apiUrlMaker } from '@shared/utils';

@Component({
  selector: 'app-products-form',
  imports: [FormField],
  providers: [ProductsApiService],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsFormComponent implements OnInit {
  readonly save = output<FormData>();
  readonly saveEdittedProduct = output<FormData>();
  readonly editingProduct = input<Product | null>(null);
  readonly productFormModel = signal<ProductFormModel>(initialProductFormModel);
  readonly productForm = form(this.productFormModel, productValidationSchema);
  readonly mode = computed(() => this.editingProduct() ? 'edit' : 'create');
  readonly displayImageUrl = 
    computed(() => this.productFormModel().imageUrl ? apiUrlMaker(this.productFormModel().imageUrl) : null);
  readonly imageFile = signal<File | null>(null);
  categories = signal<string[]>(PRODUCT_CATEGORIES);

  constructor() {
    effect(() => {
      this.setUpdateState();
    });
  }

  ngOnInit() {    
  }

  saveProduct() {
    if (this.mode() === 'edit') {
      this.updateProduct();
    } else {
      this.addProduct();
    }
    this.clearForm()
  }

  addProduct() {
    this.save.emit(this.buildFormData());
    this.clearForm();
  }
  
  updateProduct() {
    this.saveEdittedProduct.emit(this.buildFormData());
    this.clearForm();
  }
   cancelEdit() {
    this.clearForm()
  }

  onFileSelected(event: Event | null) {
    if (!event) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.setImage(input.files[0]);
    }
  }

  private setImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      this.productFormModel
        .update(prev => ({ ...prev, imageUrl: url }));
      this.imageFile.set(file);
    };
    reader.readAsDataURL(file);
  }
  
  private setUpdateState(){
    const editingProduct = this.editingProduct();
    if (editingProduct) {
      this.productFormModel.set({...editingProduct}); 
    } else {
      this.clearForm();
    }
  }
  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.productFormModel().name);
    formData.append('description', this.productFormModel().description);
    formData.append('price', String(this.productFormModel().price));
    if (this.productFormModel().category) {
      formData.append('category', this.productFormModel().category);
    }
    if (this.imageFile()) {
      formData.append('image', this.imageFile()!);
    }
    return formData;
  }
  private clearForm() {
    this.productForm().reset();
    this.productFormModel.set(initialProductFormModel);
  }
}
