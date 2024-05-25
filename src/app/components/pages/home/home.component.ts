import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';

import { DialogsService } from '../../../services/dialogs/dialogs.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFabButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{

  constructor(private dialogsService: DialogsService) { }

  handleOpenChat(): void {
    this.dialogsService.openChatDialog();
  }

}
