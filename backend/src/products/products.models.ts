export interface ProductCreateBodyDto {
  name: string;
  description: string;
  price: string;
  category?: string;
  imageUrl?: string;
}

export interface ProductUpdateBodyDto {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  imageUrl?: string;
}

export interface ProductCreateDto {
  name: string;
  description: string;
  price: string;
  category?: string;
  imageUrl?: string;
}

export interface ProductUpdateDto {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  imageUrl?: string;
}
