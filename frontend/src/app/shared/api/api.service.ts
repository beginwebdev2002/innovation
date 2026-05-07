import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../config/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get(url: string, params?: any) { return this.http.get(`${environment.apiUrl}/${url}`, { params }); }
  post(url: string, body: any) { return this.http.post(`${environment.apiUrl}/${url}`, body); }
  postForm(url: string, formData: FormData) { return this.http.post(`${environment.apiUrl}/${url}`, formData); }
  put(url: string, body: any) { return this.http.put(`${environment.apiUrl}/${url}`, body); }
  putForm(url: string, formData: FormData) { return this.http.put(`${environment.apiUrl}/${url}`, formData); }
  delete(url: string) { return this.http.delete(`${environment.apiUrl}/${url}`); }
}
