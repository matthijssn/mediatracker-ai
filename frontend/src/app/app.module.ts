// frontend/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MediaModule } from './media/media.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { SettingsModule } from './settings/settings.module';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './core/material.module';
import { RatingComponent } from './shared/rating.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, AppRoutingModule, MaterialModule, MediaModule, RecommendationsModule, SettingsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
