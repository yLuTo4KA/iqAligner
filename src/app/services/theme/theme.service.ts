import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getPrefersColor());
  private body = document.body;
  theme$ = this.themeSubject.asObservable();

  constructor() { }

  private getPrefersColor(): string {
    const lastTheme = localStorage.getItem('theme');
    if (lastTheme) {
      return lastTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme: string): void {
    if (this.themeSubject.value !== theme) {
      this.themeSubject.next(theme);

    }
    this.updateBodyClass(theme);
    localStorage.setItem('theme', theme);

  }

  private updateBodyClass(theme: string): void {
    if (theme === 'dark') {
      this.body.classList.add('dark');
      this.body.classList.remove('light');
    } else {
      this.body.classList.add('light');
      this.body.classList.remove('dark');
    }
  }
}
