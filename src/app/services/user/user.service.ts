import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../../models/User.interface";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<any | null>(null);
  private apiUrl: string = "http://localhost:2888/api/user";

  constructor(private http: HttpClient) { }

  getUser(token: string): Observable<User | null> {
    const headers = new HttpHeaders({ 'authorization': token });
    return this.http.get<User>(this.apiUrl, { headers });
  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  fetchUser(token: string): void {
    this.getUser(token).subscribe(
      {
        next: user => {
          if (user !== null) {
            this.setUser(user);
          }
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }
}
