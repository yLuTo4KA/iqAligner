import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';


import { generatedReview, Review, countReviews } from '../../models/Review.interface';


@Injectable({
  providedIn: 'root'
})

export class ReviewsService {
  
  private apiUrl: string = "http://51.21.85.46:8000/api/reviews";

  private reviewsSubject: BehaviorSubject<Review[] | null> = new BehaviorSubject<Review[] | null>(null);
  private countReviewsSubject: BehaviorSubject<countReviews> = new BehaviorSubject<countReviews>({count: 0});
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  reviews$ = this.reviewsSubject.asObservable();
  countReviews$ = this.countReviewsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  getReviews(): Observable<Review[]> {
    this.loadingSubject.next(true);
    return this.http.get<Review[]>(this.apiUrl + "/getReviews", {}).pipe(
      tap(response => {
        if(response) {
          this.reviewsSubject.next(response);
        }
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 404) {
          console.error("Ошибка загрузки отзывов")
        }
        return throwError(() => "Ошибка загрузки отзывов");
      })
    )
  }
  getCountReviews(): Observable<countReviews> {
    return this.http.get<countReviews>(this.apiUrl + "/getCount", {}).pipe(
      tap(response => this.countReviewsSubject.next(response)),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 404) {
          console.error("Ошибка подсчета кол-ва отзывов")
        }
        return throwError(() => "Ошибка подсчета");
      })
    );
  }
  generateReview(grade: number): Observable<generatedReview> {
    this.loadingSubject.next(true);
    const data = {grade}
    return this.http.post<generatedReview>(this.apiUrl + "/generateReview", data).pipe(
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 404) {
          console.error("Ошибка генерации отзыва")
        }
        return throwError(() => "Ошибка генерации отзыва");
      })
    )
  }
  
  sendReview(comment: string, rating: number): Observable<any> {
    this.loadingSubject.next(true);
    const data = {comment, rating};
    return this.http.post<any>(this.apiUrl + "/createReview", data).pipe(
      finalize(() => {
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status === 404) {
          console.error("Ошибка отправки отзыва")
        }
        return throwError(() => "Ошибка отправки отзыва");
      })
    );
  }

}
