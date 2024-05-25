import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';

import { User } from "../../models/User.interface";

import { AuthorizationService } from '../../services/authorization/authorization.service';
import { Subscription } from 'rxjs';

interface login {
  username: string,
  password: string
}

@Component({
  selector: 'app-dialog-authorization',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, HttpClientModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './dialog-authorization.component.html',
  styleUrl: './dialog-authorization.component.scss'
})


export class DialogAuthorizationComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  public loginForm: FormGroup;
  public regForm: FormGroup;

  public isLoading: boolean = false;
  public error: string | null = null;

  public loginFormSubmit: boolean = false;

  public regFormSubmit: boolean = false;


  constructor(private authService: AuthorizationService, private matDialog: MatDialog) {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })

    this.regForm = new FormGroup({
      username: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(55)]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      mail: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.minLength(12), Validators.maxLength(12)]),
      firstName: new FormControl("", [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl("", [Validators.maxLength(55)])
    })
  }

  public passwordVisibility: boolean = false;
  public registration: boolean = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.loading$.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );
    this.subscriptions.add(
      this.authService.error$.subscribe(error => {
        this.error = error;
      })
    );
  }

  handleChangeForm(): void {
    this.error = null;
    this.registration = !this.registration;
  }

  handleOnLogin(loginData: login): void {
    this.loginFormSubmit = true;
    const loginFormValid = this.loginForm.valid;
    if (loginFormValid) {
      this.subscriptions.add(
        this.authService.login(loginData.username, loginData.password).subscribe((response) => {
          this.closeModal();
        })
      );
    }
  };
  handleOnReg(userData: User): void {
    this.regFormSubmit = true;
    const regFormValid = this.regForm.valid;
    if (regFormValid) {
      this.subscriptions.add(
        this.authService.registration(userData).subscribe((response) => {
          this.closeModal();
        })
      )
    }
  };
  closeModal(): void {
    this.matDialog.closeAll();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
