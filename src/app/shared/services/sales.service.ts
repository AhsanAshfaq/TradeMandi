import { Injectable } from '@angular/core';
import { Sale } from '../models/sale';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SaleApiService {

  endpoint = 'http://localhost:4000/api';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  AddSale(data: Sale): Observable<any> {
    console.log(data);
    const API_URL = `${this.endpoint}/sale`;
    return this.http.post(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  GetSales() {
    return this.http.get(`${this.endpoint}/sales`);
  }

  GetSale(id): Observable<any> {
    const API_URL = `${this.endpoint}/sale/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  GetSaleByTruckNumber(truckNumber): Observable<any> {
    const API_URL = `${this.endpoint}/sale/${truckNumber}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  UpdateSale(id, data): Observable<any> {
    const API_URL = `${this.endpoint}/sale/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  DeleteSale(id): Observable<any> {
    const API_URL = `${this.endpoint}/sale/${id}`;
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
    return throwError(errorMessage);
  }

}
