// frontend/src/app/core/services/media-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MediaApiService {
  base = environment.apiBase;
  constructor(private http: HttpClient) {}
  list(params?: any): Observable<any> { return this.http.get(`${this.base}/media`, { params }); }
  get(id: string) { return this.http.get(`${this.base}/media/${id}`); }
  create(payload: any) { return this.http.post(`${this.base}/media`, payload); }
  update(id: string, payload: any) { return this.http.put(`${this.base}/media/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.base}/media/${id}`); }
  patchRating(id: string, payload: any) { return this.http.patch(`${this.base}/media/${id}/rating`, payload); }
  getExternal(id: string) { return this.http.get(`${this.base}/media/${id}/external`); }
  refreshExternal(id: string) { return this.http.post(`${this.base}/media/${id}/external/refresh`, {}); }
}