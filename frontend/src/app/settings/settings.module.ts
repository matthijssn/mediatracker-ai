// frontend/src/app/settings/settings.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from '../core/material.module';

@NgModule({ declarations: [SettingsComponent], imports: [CommonModule, MaterialModule], exports: [SettingsComponent] })
export class SettingsModule {}
