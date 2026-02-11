import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaApiService } from '../core/services/media-api.service';

@Component({
  selector: 'app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {
  item: any; external: any;
  constructor(private route: ActivatedRoute, private media: MediaApiService) {}
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id')!;
    this.media.get(id).subscribe((res:any)=> this.item = res);
    this.media.getExternal(id).subscribe((res:any)=> this.external = res);
  }
  refresh(){
    const id = this.route.snapshot.paramMap.get('id')!;
    this.media.refreshExternal(id).subscribe((res:any)=> this.external = res);
  }
}
