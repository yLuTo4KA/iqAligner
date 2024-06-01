import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DialogsService } from '../../../services/dialogs/dialogs.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { User } from '../../../models/User.interface';


import { Result } from '../../../models/Result.interface';

import { ChatService } from '../../../services/chat/chat.service';

import { BotMessageComponent } from './botMessage/bot-message.component';
import { UserMessageComponent } from './userMessage/user-message.component';
import { BotMessageTypingComponent } from './botMessageTyping/bot-message-typing.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user/user.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-dialog-chat',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, BotMessageComponent, BotMessageTypingComponent, UserMessageComponent, MatProgressSpinnerModule],
  templateUrl: './dialog-chat.component.html',
  styleUrl: './dialog-chat.component.scss'
})
export class DialogChatComponent implements AfterViewInit, OnInit, OnDestroy {

  private subscriptions = new Subscription();

  @ViewChild('chatArea', { read: ViewContainerRef }) chatArea!: ViewContainerRef;
  @ViewChild('area') area!: ElementRef<HTMLDivElement>;

  public userData: User | null = null;
  public disable: boolean = false;
  public isShowAnswers: boolean = false;
  public started: boolean = false;

  public message: string = '';

  public answersList: string[] = []
  public error: boolean = false;

  private questionIndex: number = 0;

  public questions: any | null = null;
  private chatId: string | null = null;

  public currentAnswrs!: string[];


  public resultLoading: boolean = false;
  public result: Result | null = null;

  constructor(private userService: UserService, private dialogsService: DialogsService, private chatService: ChatService) { }
  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.getUserObservable().subscribe({
        next: userData => this.userData = userData,
        error: error => console.log(error),
      })
    );
    this.initChat();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createBotMessage('Здравствуйте! Я ваш бот помошник! Давайте я вам помогу определить ваш тип личности и подходящие вам профессии! Вам нужно будет ответить на пару вопросов!');
    }, 0);
  }
  initChat(): void {
    this.error = false;
    this.subscriptions.add(
      this.chatService.getQuestions().subscribe({
        next: response => {
          setTimeout(() => {
            this.chatId = response.chatId;
            this.questions = response.questions;
          }, 100)
        },
        error: error => {
          this.error = true;
        }
      })
    );
  }

  startChat(): void {
    this.started = true;
    this.nextQuestion();
  }

  submitMessage() {
    if (this.message.trim() !== '' && this.message.length > 1 && this.questions !== null) {
      this.answersList.push(this.message);
      this.createUserMessage();
      this.clearMessage();
      if (this.answersList.length === this.questions.questions.length && this.chatId) {
        this.disable = true;
        this.resultLoading = true;
        this.subscriptions.add(
          this.chatService.getResult(this.answersList, this.questions.questions, this.chatId).subscribe(
            {
              next: response => {
                if (response) {
                  setTimeout(() => {
                    this.createBotMessage('', response);
                    this.subscriptions.add(this.userService.getAllAnswer().subscribe());
                  }, 100)
                }
                this.resultLoading = false;
              },
              error: error => {
                this.error = true;
                this.chatScrollBottom();
              }
            }
          )
        );
      } else {
        this.nextQuestion();
      }
    }
  }


  pickAnswer(answer: string) {
    this.message = answer;
    this.submitMessage();
  }

  nextQuestion(): void {
    this.createBotMessage(this.questions.questions[this.questionIndex].question);
    this.currentAnswrs = this.questions.questions[this.questionIndex].answers;
    this.questionIndex++;
  }

  createBotMessage(text?: string, answer?: Result) {
    const botMessage = this.chatArea.createComponent(BotMessageComponent);
    if (answer) {
      botMessage.instance.answer = answer;
    }
    if (text) {
      botMessage.instance.text = text;
    }
    this.chatScrollBottom();
  }

  createUserMessage() {
    const userMessage = this.chatArea.createComponent(UserMessageComponent);
    userMessage.instance.userData = this.userData;
    userMessage.instance.text = this.message;
    this.chatScrollBottom();
  }

  chatScrollBottom() {
    const chatAreaElement = this.area.nativeElement;
    setTimeout(() => {
      chatAreaElement.scrollTo({ top: chatAreaElement.scrollHeight - chatAreaElement.clientHeight, behavior: "smooth" })
    }, 1000)
  }
  clearMessage() {
    this.message = '';
  }

  closeModal() {
    this.dialogsService.closeDialog();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
