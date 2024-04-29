import { Component, OnInit } from '@angular/core';

import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { UserService } from '../../../services/user/user.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  token: string | null = null;
  constructor(private auth: AuthorizationService, private user: UserService) { }

  ngOnInit(): void {
    this.auth.token$.subscribe(token => {
      this.token = token;
    })
    if (this.token) {
      console.log(this.token);
      this.user.getUser(this.token).subscribe(response => {
        console.log(response)
      });

    }
  }

}
