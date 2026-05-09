import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Product } from '@features/products/models/products.model';

@Injectable()
export class ProductsApiService {
  private http = inject(HttpClient);

  get(url: string, params?: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/${url}`, { params }); 
  }

  post(url: string, body: FormData): Observable<Product> { 
    return this.http.post<Product>(`${environment.apiUrl}/${url}`, body); 
  }

  put(url: string, body: FormData): Observable<Product> { 
    return this.http.put<Product>(`${environment.apiUrl}/${url}`, body); 
  }

  delete(url: string): Observable<Product> { 
    return this.http.delete<Product>(`${environment.apiUrl}/${url}`); 
  }
}
