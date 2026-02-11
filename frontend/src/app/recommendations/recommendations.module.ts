// frontend/src/app/recommendations/recommendations.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecommendationsComponent } from './recommendations.component';
import { MaterialModule } from '../core/material.module';

@NgModule({ declarations: [RecommendationsComponent], imports: [CommonModule, MaterialModule, RouterModule], exports: [RecommendationsComponent] })
export class RecommendationsModule {}
