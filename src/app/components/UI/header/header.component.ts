import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { UserService } from '../../../services/user/user.service';
import { DialogsService } from '../../../services/dialogs/dialogs.service';

import { User } from '../../../models/User.interface';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatFabButton, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private dialogService: DialogsService, private authService: AuthorizationService, private userService: UserService) { }
  ;
  private subscriptions = new Subscription();
  token: string | null = null;
  userData: User | null = null;

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.token$.subscribe({
        next: token => this.token = token,
        error: error => console.log(error),
      })
    );
    this.subscriptions.add(
      this.userService.getUserObservable().subscribe({
        next: userData => this.userData = userData,
        error: error => console.log(error),
      })
    );

    if (!this.userData && this.token) {
      this.userService.getUser();
    }
  }

  openAuthDialog(): void {
    this.dialogService.openAuthDialog();
  }

  handleLogout() {
    this.authService.removeToken();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
