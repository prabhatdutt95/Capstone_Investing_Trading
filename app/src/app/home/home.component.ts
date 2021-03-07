import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'app/data.service';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allStocks = [];
  stockQuery = '';
  stockList = [];
  selectedChart = 'line';
  selectedStock ;
  twitterHandle = 'https://twitter.com/NSEIndia';
  @ViewChild('wrapper') wrapper: ElementRef<HTMLDivElement>;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getStocks();
  }

  getStocks() {
    this.dataService.getAllStocks().subscribe((res) => {
      console.log(res.res)
      res.res.forEach(stock => {
        stock.change = (((Math.abs(stock.Close - stock.Open))/stock.Close) * 100).toFixed(1);
        stock.Twitter_handle = stock.Twitter_handle ? stock.Twitter_handle.replace('\@', '') : 'NSEIndia';
        this.stockList.push(stock.Company_Name);
      })
      this.allStocks = res.res;
      // this.selectedStock = this.allStocks[0];
      // this.twitterHandle = 'https://twitter.com/' + this.allStocks[0].Twitter_handle;
      setTimeout(() => {
        this.wrapper.nativeElement.innerHTML = `<a class="twitter-timeline" href="${this.twitterHandle}">Tweet</a>`;
        window['twttr'] && window['twttr'].widgets.load();
      }, 0);
    })
  }
  selectStock(clickedStock?) {
    this.twitterHandle = null;
    this.stockQuery = clickedStock ? clickedStock.Company_Name : this.stockQuery;
    const stock = this.allStocks.find(_ => _.Company_Name == this.stockQuery);
    this.selectedStock = stock ? stock : this.selectedStock;
    this.getPrediction();
    this.twitterHandle = 'https://twitter.com/' + this.selectedStock.Twitter_handle
    setTimeout(() => {
      this.wrapper.nativeElement.innerHTML = `<a class="twitter-timeline" href="${this.twitterHandle}">Tweet</a>`;
      window['twttr'] && window['twttr'].widgets.load();
    }, 0);
  }
  removeStock() {
    this.selectedStock = null;
    this.twitterHandle = 'https://twitter.com/NSEIndia';
    setTimeout(() => {
      this.wrapper.nativeElement.innerHTML = `<a class="twitter-timeline" href="${this.twitterHandle}">Tweet</a>`;
      window['twttr'] && window['twttr'].widgets.load();
    }, 0);
  }
  getPrediction() {
    this.dataService.getPediction(this.selectedStock.Symbol).subscribe((res) => {
      this.selectedStock.polarity = res.polarity_status;
    })
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.stockList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
}
