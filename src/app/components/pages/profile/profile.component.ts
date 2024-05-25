import { Component, OnDestroy, OnInit } from '@angular/core';

import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/User.interface';
import { Answer } from '../../../models/Answers.interface';
import { MatFabButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { ResultCardComponent } from '../../result-card/result-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFabButton, ResultCardComponent, MatProgressSpinner],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  token: string | null = null;
  userData: User | null = null;
  change: boolean = true;
  answers: Answer[] | null = null;
  loading: boolean = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.userService.getUserObservable().subscribe({
      next: userData => this.userData = userData,
      error: error => console.log(error),
    }));
    this.subscriptions.add(
      this.userService.answers$.subscribe(answers => this.answers = answers)
    );
    this.subscriptions.add(
      this.userService.loading$.subscribe(loading => this.loading = loading)
    );
    this.subscriptions.add(
      this.userService.getAllAnswer().subscribe()
    );

    if (!this.userData) {
      this.userService.getUser();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
