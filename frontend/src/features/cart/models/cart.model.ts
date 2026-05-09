import { Product } from '@features/products';

export interface CartItem {
    id: number;
    quantity: number;
    productId: number;
    product: Product;
}
