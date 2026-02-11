import { Component, OnInit } from '@angular/core';
import { RecommendationApiService } from '../core/services/recommendation-api.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  recs: any[] = [];
  constructor(private recSvc: RecommendationApiService) {}
  ngOnInit(){ this.recSvc.getGlobal().subscribe((res:any)=> this.recs = res); }
}
