import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DialogsService } from '../../services/dialogs/dialogs.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/User.interface';

import { Questions, Question } from '../../models/Questions.interface';
import { Result } from '../../models/Result.interface';

import { ChatService } from '../../services/chat/chat.service';

import { BotMessageComponent } from './botMessage/bot-message.component';
import { UserMessageComponent } from './userMessage/user-message.component';
import { BotMessageTypingComponent } from './botMessageTyping/bot-message-typing.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user/user.service';



@Component({
  selector: 'app-dialog-chat',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, BotMessageComponent, BotMessageTypingComponent, UserMessageComponent, MatProgressSpinnerModule],
  templateUrl: './dialog-chat.component.html',
  styleUrl: './dialog-chat.component.scss'
})
export class DialogChatComponent implements AfterViewInit, OnInit {

  @ViewChild('chatArea', { read: ViewContainerRef }) chatArea!: ViewContainerRef;
  @ViewChild('area') area!: ElementRef<HTMLDivElement>;
  public userData: User | null = null;
  public disable: boolean = false;
  public isShowAnswers: boolean = false;
  public started: boolean = false;

  public message: string = '';

  public answersList: string[] = []

  private questionIndex: number = 0;

  public questions: any | null = null;
  private chatId: string | null = null;

  public currentAnswrs!: string[];


  public resultLoading: boolean = false;
  public result: Result | null = null;

  constructor(private userService: UserService , private dialogsService: DialogsService, private chatService: ChatService) { }
  ngOnInit(): void {
    this.userService.getUserObservable().subscribe({
      next: userData => this.userData = userData,
      error: error => console.log(error),
    }); 
    this.initChat();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createBotMessage('Здравствуйте! Я ваш бот помошник! Давайте я вам помогу определить ваш тип личности и подходящие вам профессии! Вам нужно будет ответить на пару вопросов!');
    }, 0);
  }
  initChat(): void {
    this.chatService.getQuestions().subscribe(response => {
      this.chatId = response.chatId;
      this.questions = response.questions;
    })
  }

  startChat():void {
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
        this.chatService.getResult(this.answersList, this.questions.questions, this.chatId).subscribe(response => {
          console.log(response);
          if(response.analys) {
            this.createBotMessage(response.analys);
          }
          this.resultLoading = false;
        })

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
    this.chatScrollBottom();
    this.currentAnswrs = this.questions.questions[this.questionIndex].answers;
    this.questionIndex++;
  }

  createBotMessage(text: string) {
    const botMessage = this.chatArea.createComponent(BotMessageComponent);
    botMessage.instance.text = text;
  }

  createUserMessage() {
    const userMessage = this.chatArea.createComponent(UserMessageComponent);
    userMessage.instance.userData = this.userData;
    userMessage.instance.text = this.message;
  }

  chatScrollBottom() {
    const chatAreaElement = this.area.nativeElement;
    chatAreaElement.scrollTo({ top: chatAreaElement.scrollHeight - chatAreaElement.clientHeight, behavior: "smooth" })
  }
  clearMessage() {
    this.message = '';
  }

  closeModal() {
    this.dialogsService.closeDialog();
  }
}
