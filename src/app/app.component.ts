import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/UI/header/header.component';
import { FooterComponent } from './components/UI/footer/footer.component';
import { MatFabButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { DialogsService } from './services/dialogs/dialogs.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, MatFabButton, MatIconModule, HttpClientModule]
})
export class AppComponent implements OnInit{
  public theme!: string;

  constructor(private dialogsService: DialogsService, private themeService: ThemeService) {}
  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
      this.themeService.setTheme(theme);
    })
  }
  
  handleChangeTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(this.theme);
  }


  handleOpenChat(): void {
    this.dialogsService.openChatDialog();
  }
}
