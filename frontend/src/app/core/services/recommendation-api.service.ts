// frontend/src/app/core/services/recommendation-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecommendationApiService {
  base = environment.apiBase;
  constructor(private http: HttpClient) {}
  getGlobal(limit = 20) { return this.http.get(`${this.base}/recommendations?limit=${limit}`); }
  forMedia(mediaId: string, limit = 20) { return this.http.get(`${this.base}/recommendations/media/${mediaId}?limit=${limit}`); }
  forCategory(category: string, limit = 20) { return this.http.get(`${this.base}/recommendations/category/${category}?limit=${limit}`); }
}