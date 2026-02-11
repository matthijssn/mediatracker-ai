// frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaListComponent } from './media/media-list.component';
import { MediaDetailComponent } from './media/media-detail.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'media', pathMatch: 'full' },
  { path: 'media', component: MediaListComponent },
  { path: 'media/:id', component: MediaDetailComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'media' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
