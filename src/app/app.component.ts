import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatFabButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { DialogsService } from './services/dialogs/dialogs.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, MatFabButton, MatIconModule, HttpClientModule]
})
export class AppComponent {
  public theme: String = '--light';

  constructor(private dialogsService: DialogsService) {}

  handleChangeTheme(): void {
    this.theme = this.theme === '--light' ? '--dark' : '--light';
  }


  handleOpenChat(): void {
    this.dialogsService.openChatDialog();
  }
}
