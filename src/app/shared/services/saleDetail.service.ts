import { Injectable } from '@angular/core';
import { SaleDetail } from '../models/saleDetail';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SaleDetailApiService {

  endpoint = 'http://localhost:4000/api';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  AddSaleDetail(data: SaleDetail) {
    const API_URL = `${this.endpoint}/saledetail`;
    return this.http.post(API_URL, data);
  }

  GetSaleDetails() {
    return this.http.get(`${this.endpoint}/saledetails`);
  }

  GetSaleDetail(id) {
    const API_URL = `${this.endpoint}/saledetail/${id}`;
    return this.http.get(API_URL, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  UpdateSaleDetail(id, data) {
    const API_URL = `${this.endpoint}/saledetail/${id}`;
    return this.http.put(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  DeleteSaleDetail(id) {
    const API_URL = `${this.endpoint}/saledetail/${id}`;
    return this.http.delete(API_URL).subscribe((data: any) => {
      console.log(data);
    });
  }

  UpdateSaleDetailsBySaleId(id) {
    return this.http.get(`${this.endpoint}/saledetails/sale/${id}`);
  }
  errorMgmt(error: HttpErrorResponse) {
    console.log(error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error);
    return throwError(errorMessage);
  }

}
