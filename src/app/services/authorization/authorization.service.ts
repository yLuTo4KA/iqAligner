import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, finalize, BehaviorSubject, catchError, throwError } from 'rxjs';

import {User } from "../../models/User.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl: string = "http://localhost:2888/api";
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getToken());
  private errorSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  constructor(private http: HttpClient) { }
  
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }
  get error$(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
    this.tokenSubject.next(token);
  }
  getToken(): string | null {
    return localStorage.getItem("token");
  }
  removeToken(): void {
    localStorage.removeItem("token");
    this.tokenSubject.next(null);
  } 
  registration(regData: User): Observable<any> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    return this.http.post<any>(this.apiUrl + "/reg", regData).pipe(
      tap(response => {
        if(response && response.token) {
          this.setToken(response.token);
        }
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorSubject.next(error.error);
        return throwError(() => error);
      })
    )
  }
  login(username: string, password: string): Observable<any> {
    const data = {username, password};
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    return this.http.post<any>(this.apiUrl + "/login", data).pipe(
      tap(response => {
        if(response && response.token !== null) {
          this.setToken(response.token);
        }
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorSubject.next(error.error);
        if(error.status === 404) {
          console.error("Логин или пароль не правильный!")
        }
        return throwError(() => "Ошибка авторизации");
      })
    );
  }
}
