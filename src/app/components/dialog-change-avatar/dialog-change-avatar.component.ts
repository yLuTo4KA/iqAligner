import { Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-change-avatar',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, FormsModule, MatFabButton],
  templateUrl: './dialog-change-avatar.component.html',
  styleUrl: './dialog-change-avatar.component.scss'
})
export class DialogChangeAvatarComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  public selectedFile: File | null = null;
  public loading: boolean = false;
  public statusMessage: string | null = null

  constructor(private matDialog: MatDialog, private userService: UserService){}
  
  ngOnInit(): void {
    this.subscriptions.add(this.userService.loading$.subscribe(loading => this.loading = loading));
  }

  onSubmit(): void {
    
    if(!this.selectedFile) {
      this.statusMessage = 'Выберите файл!'
      return;
    }
    const formData = new FormData();
    formData.append('avatar', this.selectedFile);
    
    this.userService.updateAvatar(formData).subscribe(
      {
        next: data => {
          this.closeModal()
        },
        error: error => {
          console.error(error);
          this.statusMessage = error;
        }
      }
    );
  }
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    this.statusMessage = '';
  }


  closeModal(): void {
    this.matDialog.closeAll();
  }

  ngOnDestroy():void {
    this.subscriptions.unsubscribe();
  }

}
