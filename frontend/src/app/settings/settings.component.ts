import { Component } from '@angular/core';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  theme = 'light';
  fontSize = 'normal';
  constructor(private themeSvc: ThemeService) { this.theme = this.themeSvc.getTheme(); }
  onTheme(t:string){ this.themeSvc.applyTheme(t as any); this.theme = t; }
  onFont(s:string){ this.fontSize = s; }
}
