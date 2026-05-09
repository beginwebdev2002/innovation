import { maxLength, min, required } from "@angular/forms/signals";

export interface Product {
    id: string;
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
    name: '',
    price: 0,
    category: '',
    description: '',
    imageUrl: '',
    image: null
}

export function productValidationSchema(schema: any) {
    required(schema.name);
    maxLength(schema.name, 50);

    required(schema.price);
    min(schema.price, 0);

    required(schema.category);
    maxLength(schema.category, 50);

    required(schema.description);
    maxLength(schema.description, 300);

    required(schema.imageUrl); 
}
