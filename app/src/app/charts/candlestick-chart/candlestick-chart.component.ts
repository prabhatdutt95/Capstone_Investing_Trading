import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from 'app/data.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'candlestick-chart',
  templateUrl: './candlestick-chart.component.html',
  styleUrls: ['./candlestick-chart.component.css']
})
export class CandlestickChartComponent implements OnInit, OnChanges {

  @Input() selectedStock;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  selectedChart = 30;
  isLoaded = false;
  constructor(private dataService: DataService) {
  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedStock': {
            this.getPastData()
          }
        }
      }
    }
  }

  bindChartData(data) {
    this.chartOptions = {
      series: [
        {
          name: "candle",
          data: data
        }
      ],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        text: "CandleStick Chart",
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }

  getPastData() {
    let code = this.selectedStock.Symbol
    let days = this.selectedChart;
    let pastData = []
    this.dataService.getPastData(code, days).subscribe((res) => {
      // console.log(res.res)
      res.res.forEach(data => {
        let candleData = {
          x: new Date(data.Date),
          y: [data.Open, data.High, data.Low, data.Close]
        }
        pastData.push(candleData)
      });
      this.isLoaded = true;
      this.bindChartData(pastData)
    })
    
  }


}
