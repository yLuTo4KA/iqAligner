import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatFabButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, MatFabButton, MatIconModule]
})
export class AppComponent {
  public theme: String = '--light';
  handleChangeTheme(): void {
    this.theme = this.theme === '--light' ? '--dark' : '--light';
    console.log(this.theme);
  }
}
