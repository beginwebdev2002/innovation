import { maxLength, min, required, schema } from "@angular/forms/signals";

export enum ProductCategory {
    Electronics = 'Электроника',
    Clothing = 'Одежда',
    Shoes = 'Обувь',
    Accessories = 'Аксессуары',
    Home = 'Для дома',
    Beauty = 'Красота',
    Sports = 'Спорт',
    Food = 'Еда'
}

export const PRODUCT_CATEGORIES = Object.values(ProductCategory);

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
}

export const initialProductFormModel: ProductFormModel = {
    name: '',
    price: 0,
    category: ProductCategory.Electronics,
    description: '',
    imageUrl: ''
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

});
