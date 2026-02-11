// frontend/src/app/media/media.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaListComponent } from './media-list.component';
import { MediaDetailComponent } from './media-detail.component';
import { RatingComponent } from '../shared/rating.component';
import { MaterialModule } from '../core/material.module';

@NgModule({ declarations: [MediaListComponent, MediaDetailComponent, RatingComponent], imports: [CommonModule, MaterialModule], exports: [MediaListComponent, MediaDetailComponent] })
export class MediaModule {}
