export class AuthenticatedRequest {
  user: { userId: number };
}

export class AddToCartDto {
  productId: number;
  quantity: number;
}
