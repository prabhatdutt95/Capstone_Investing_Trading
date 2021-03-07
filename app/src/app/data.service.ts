import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  allStocksUrl = "https://stockdatatryout.herokuapp.com/all";
  constructor(private httpClient: HttpClient) { }

  getAllStocks(): Observable<any>{
    return this.httpClient.get<any>(this.allStocksUrl);
  }
  getPediction(keyword): Observable<any> {
    return this.httpClient.get<any>('https://stockdatatryout.herokuapp.com/tweets', {
      params: {
        keyword
      },
    })
  }
  getPastData(code, days): Observable<any> {
    return this.httpClient.get<any>('https://stockdatatryout.herokuapp.com/pastData', {
      params: {
        code: code,
        days: days
      },
    })
  }

  getPredictedData(code): Observable<any> {
    return this.httpClient.get<any>('https://stockdatatryout.herokuapp.com/predict', {
      params: {
        id: code,
      },
    }) 
  }
}
