import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CartService {
  private http = inject(HttpClient);

  get<T = unknown>(url: string, options?: Record<string, unknown>): Observable<T> {
    return this.http.get<T>(url, options) as Observable<T>;
  }

  post<T = unknown>(url: string, body: unknown, options?: Record<string, unknown>): Observable<T> {
    return this.http.post<T>(url, body, options) as Observable<T>;
  }

  put<T = unknown>(url: string, body: unknown, options?: Record<string, unknown>): Observable<T> {
    return this.http.put<T>(url, body, options) as Observable<T>;
  }

  delete<T = unknown>(url: string, options?: Record<string, unknown>): Observable<T> {
    return this.http.delete<T>(url, options) as Observable<T>;
  }
}
