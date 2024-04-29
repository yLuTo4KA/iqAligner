import { Component, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { AuthorizationService } from '../../services/authorization/authorization.service';
import { UserService } from '../../services/user/user.service';
import { DialogsService } from '../../services/dialogs/dialogs.service';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatFabButton, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  token: string | null = null;
  constructor(private dialogService: DialogsService,private authService: AuthorizationService, private userService: UserService){};
  img: string = "../assets/defaultProfile.png";
  ngOnInit(): void {
      this.authService.token$.subscribe(token => {
        this.token = token;
        console.log(token);
      })
  }

  openAuthDialog(): void {
    this.dialogService.openAuthDialog();
  }

  handleLogout() {
    this.authService.removeToken();
  }
}
