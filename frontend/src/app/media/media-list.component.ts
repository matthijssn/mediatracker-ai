// frontend/src/app/media/media-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaApiService } from '../core/services/media-api.service';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {
  items: any[] = [];
  constructor(private media: MediaApiService, private router: Router) {}
  ngOnInit(){ this.media.list().subscribe((res:any)=> this.items = res); }
  getRating(m:any){ return m._rating || 0; }
  onRate(m:any, value:number){ this.media.patchRating(m._id || m.id, { rating: value }).subscribe(r => { m._rating = value; }); }
  view(m:any){ this.router.navigate(['/media', m._id || m.id]); }
}
