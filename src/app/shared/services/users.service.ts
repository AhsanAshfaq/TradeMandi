import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  endpoint = 'http://localhost:4000/api';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  AddUser(data: Student): Observable<any> {
    const API_URL = `${this.endpoint}/user`;
    console.log(API_URL);
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  GetUsers() {
    return this.http.get(`${this.endpoint}/users`);
  }

  GetUser(id): Observable<any> {
    const API_URL = `${this.endpoint}/user/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  UpdateUser(id, data): Observable<any> {
    const API_URL = `${this.endpoint}/user/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  DeleteUser(id): Observable<any> {
    const API_URL = `${this.endpoint}/user/${id}`;
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
