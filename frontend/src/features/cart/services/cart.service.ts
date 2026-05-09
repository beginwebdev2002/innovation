import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CartService {
  private http = inject(HttpClient);

  get<T = any>(url: string, options?: any): Observable<T> {
    return this.http.get<T>(url, options) as Observable<T>;
  }

  post<T = any>(url: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(url, body, options) as Observable<T>;
  }

  put<T = any>(url: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(url, body, options) as Observable<T>;
  }

  delete<T = any>(url: string, options?: any): Observable<T> {
    return this.http.delete<T>(url, options) as Observable<T>;
  }
}
