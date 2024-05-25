import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { User } from "../../models/User.interface";
import { Answer } from '../../models/Answers.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private answersSubject: BehaviorSubject<Answer[] | null> = new BehaviorSubject<Answer[] | null>(null);
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  answers$ = this.answersSubject.asObservable();

  // private apiUrl: string = "http://localhost:2888/api/profile";
  private apiUrl: string = "http://51.21.85.46:8000/api/profile";

  constructor(private http: HttpClient) { }

  getUser(): void {
    this.http.get<User>(this.apiUrl + '/getUser', {}).subscribe({
      next: user => {
        if(user) {
          this.userSubject.next(user);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }
  
  getAllAnswer(): Observable<Answer[]> {
    this.loadingSubject.next(true);
    return this.http.get<Answer[]>(this.apiUrl + '/getAnswers', {}).pipe(
      tap(response => {
        if(response) {
          this.answersSubject.next(response);
        }
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 404) {
          console.error("Ошибка загрузки данных")
        }
        return throwError(() => "Ошибка авторизации");
      })
    )
  }

  deauthUser(): void {
    this.userSubject.next(null);
  }

  getUserObservable(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
}
