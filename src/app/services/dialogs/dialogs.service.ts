import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthorizationService } from '../authorization/authorization.service';

import { DialogAuthorizationComponent } from '../../components/UI/dialog-authorization/dialog-authorization.component';
import { DialogChatComponent } from '../../components/UI/dialog-chat/dialog-chat.component';
import { DialogChangeAvatarComponent } from '../../components/UI/dialog-change-avatar/dialog-change-avatar.component';
import { DialogChangeUserInfoComponent } from '../../components/UI/dialog-change-user-info/dialog-change-user-info.component';
import { DialogAddReviewComponent } from '../../components/UI/dialog-add-review/dialog-add-review.component';
import { DialogCheckMoreComponent } from '../../components/UI/dialog-check-more/dialog-check-more.component';
import { Result } from '../../models/Result.interface';

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
      this.matDialog.open(DialogChatComponent, {panelClass: 'dialog-chat-custom',width: '600px'});
    } else {
      this.openAuthDialog();
    }
  }
  
  openAvatarChangeDialog(): void {
    if(this.token !== null) {
      this.matDialog.open(DialogChangeAvatarComponent, {width: '600px'});
    }else {
      this.openAuthDialog();
    }
  }

  openUserInfoChangeDialog(): void {
    if(this.token !== null) {
      this.matDialog.open(DialogChangeUserInfoComponent, {width: '600px'});
    }else {
      this.openAuthDialog();
    }
  }

  openReviewDialog(): void {
    if(this.token) {
      this.closeDialog();
      this.matDialog.open(DialogAddReviewComponent, {width: '600px'});
    }else {
      this.openAuthDialog();
    }
  }

  openCheckMoreDialog(data: Result): void {
    if(this.token) {
      this.matDialog.open(DialogCheckMoreComponent, {width: '600px', data: data});
    }else {
      this.openAuthDialog();
    }
  }
  
  closeDialog(): void {
    this.matDialog.closeAll();
  }
}
