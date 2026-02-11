// frontend/src/app/core/services/theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  applyTheme(theme: 'light'|'dark'|'colorblind') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  getTheme() { return (localStorage.getItem('theme') || 'light') as any; }
}
