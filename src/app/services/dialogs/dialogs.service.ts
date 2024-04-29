import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthorizationService } from '../authorization/authorization.service';

import { DialogAuthorizationComponent } from '../../components/dialog-authorization/dialog-authorization.component';
import { DialogChatComponent } from '../../components/dialog-chat/dialog-chat.component';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {
  token: string | null = null;

  constructor(private matDialog: MatDialog, private authService: AuthorizationService) { 
    this.authService.token$.subscribe(token => {
      this.token = token;
    })
  }

  openAuthDialog(): void {
    this.matDialog.open(DialogAuthorizationComponent, {panelClass: 'dialog-custom', width: '400px'});
  }

  openChatDialog(): void {
    if(this.token !== null) {
      this.matDialog.open(DialogChatComponent, {width: '600px'});
    } else {
      this.openAuthDialog();
    }
  }
  
  closeDialog(): void {
    this.matDialog.closeAll();
  }
}
