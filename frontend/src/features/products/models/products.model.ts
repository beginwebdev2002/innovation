import { maxLength, min, required, schema } from "@angular/forms/signals";

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductFormModel extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
    image:  File | null;
}

export const initialProductFormModel: ProductFormModel = {
    name: 'IPhone 12 Pro',
    price: 1200,
    category: 'Electronics',
    description: 'A great phone',
    imageUrl: '',
    image: null
}

export const productValidationSchema = schema<ProductFormModel>((product) => {
    required(product.name, {message: 'Введите название товара'});
    maxLength(product.name, 50, {message: 'Название товара должно быть не длиннее 50 символов'});

    required(product.price, {message: 'Введите цену товара'});
    min(product.price, 0, {message: 'Цена товара должна быть не меньше 0'});

    required(product.category, {message: 'Введите категорию товара'});
    maxLength(product.category, 50, {message: 'Категория товара должна быть не длиннее 50 символов'});

    required(product.description, {message: 'Введите описание товара'});
    maxLength(product.description, 300, {message: 'Описание товара должно быть не длиннее 300 символов'});

    required(product.image, {message: 'Выберите изображение товара'});
});
