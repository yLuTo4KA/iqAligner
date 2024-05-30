import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Subscription } from 'rxjs';

import { User } from '../../../models/User.interface';

import { DialogsService } from '../../../services/dialogs/dialogs.service';
import { UserService } from '../../../services/user/user.service';


@Component({
  selector: 'app-dialog-change-user-info',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, HttpClientModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './dialog-change-user-info.component.html',
  styleUrl: './dialog-change-user-info.component.scss'
})
export class DialogChangeUserInfoComponent implements OnInit{
  private subscriptions = new Subscription();
  public updateUser: FormGroup;
  public updateUserSubmit: boolean = false;
  public userData: User | null = null;
  
  constructor(private dialogService: DialogsService, private userService: UserService) {
    this.updateUser = new FormGroup({
      mail: new FormControl("", [Validators.required, Validators.email]),
      firstName: new FormControl("", [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl("", [Validators.maxLength(55)])
    })
  }

  ngOnInit(): void {
    this.subscriptions.add(this.userService.getUserObservable().subscribe({
      next: userData => this.userData = userData,
      error: error => console.log(error),
    }));
  }

  handleUpdateProfile(data: any) {
    this.userService.updateUser(data).subscribe( {
      next: data => {
        this.closeModal()
      },
      error: error => {
        console.error(error);
      }
    });
  }

  

  closeModal(): void {
    this.dialogService.closeDialog();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
