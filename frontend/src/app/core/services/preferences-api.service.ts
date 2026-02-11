// frontend/src/app/core/services/preferences-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PreferencesApiService {
  base = environment.apiBase;
  constructor(private http: HttpClient) {}
  get(userId?: string) { return this.http.get(`${this.base}/preferences`, { params: userId ? { userId } : {} }); }
  put(payload: any) { return this.http.put(`${this.base}/preferences`, payload); }
}