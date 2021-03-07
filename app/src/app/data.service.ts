import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  stockUrl = "http://127.0.0.1:5000/";
  constructor(private httpClient: HttpClient) { }

  getAllStocks(): Observable<any>{
    return this.httpClient.get<any>(this.stockUrl + 'all');
  }
  getPediction(keyword): Observable<any> {
    return this.httpClient.get<any>(this.stockUrl + 'tweets', {
      params: {
        keyword
      },
    })
  }
  getPastData(code, days): Observable<any> {
    return this.httpClient.get<any>(this.stockUrl + 'pastData', {
      params: {
        code: code,
        days: days
      },
    })
  }

  getPredictedData(code): Observable<any> {
    return this.httpClient.get<any>(this.stockUrl + 'predict', {
      params: {
        id: code,
      },
    }) 
  }
}
