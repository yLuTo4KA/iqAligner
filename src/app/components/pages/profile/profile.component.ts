import { Component, OnInit } from '@angular/core';

import { AuthorizationService } from '../../../services/authorization/authorization.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/User.interface';
import { Answer } from '../../../models/Answers.interface';
import { MatFabButton } from '@angular/material/button';

import { BotMessageComponent } from '../../dialog-chat/botMessage/bot-message.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFabButton, BotMessageComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  fakeAnswer = {
      analys: 'Вы такой то такой то там человек бла бла ваш тип бла бла',
      description: 'Флегматик бла бла бла',
      profession: ['Программист', 'Псхиололга', 'Терапевт','Программист', 'Псхиололга', 'Терапевт','Программист', 'Псхиололга', 'Терапевт','Программист', 'Псхиололга', 'Терапевт'],
      type: 'Флегматик',
  }
  token: string | null = null;
  userData: User | null = null;
  change: boolean = true;
  answers: Answer | null = null;
  loading: boolean = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserObservable().subscribe({
      next: userData => this.userData = userData,
      error: error => console.log(error),
    });
    this.userService.answers$.subscribe(answers => {
      this.answers = answers,
        console.log(answers);
    });
    this.userService.loading$.subscribe(loading => this.loading = loading);
    this.userService.getAllAnswer().subscribe();

    if (!this.userData) {
      this.userService.getUser();
    }
  }

}
