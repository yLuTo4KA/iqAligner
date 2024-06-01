import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Questions } from '../../models/Questions.interface';
import { Result } from '../../models/Result.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiChatUrl: string = "http://51.21.85.46:8000/api/chat";

  constructor(private http: HttpClient) { }

  
  getQuestions() {
    return this.http.post<Questions>(this.apiChatUrl + "/start", {});
  }

  getResult(userAnswer: string[], questions: Questions, chatId: string) {
    const data = {userAnswer, questions, chatId};
    return this.http.post<Result>(this.apiChatUrl + "/getAnswer", data);
  }
}
