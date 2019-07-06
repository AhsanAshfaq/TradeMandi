import { Injectable } from '@angular/core';
import { Purchase } from '../models/purchase';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PurchaseApiService {

  endpoint = 'http://localhost:4000/api';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  AddPurchase(data: Purchase): Observable<any> {
    const API_URL = `${this.endpoint}/purchase`;
    console.log(API_URL);
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  GetPurchases() {
    return this.http.get(`${this.endpoint}/purchases`);
  }

  GetPurchase(id): Observable<any> {
    const API_URL = `${this.endpoint}/purchase/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  UpdatePurchase(id, data): Observable<any> {
    const API_URL = `${this.endpoint}/purchase/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  DeletePurchase(id): Observable<any> {
    const API_URL = `${this.endpoint}/purchase/${id}`;
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
