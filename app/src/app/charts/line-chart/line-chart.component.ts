import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DataService } from 'app/data.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() selectedStock;
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  isLoaded = false;
  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedStock': {
            this.getPastData();
          }
        }
      }
    }
  }

  public initChartData(pastData, predictedData): void {
    this.series = [
      {
        name: 'Actual',
        data: pastData,
        color: '#1a1982'
      },
      {
        name: 'Predictions',
        data: predictedData,
        color: '#fc1605'
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Stock Price Movement",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val).toFixed(0);
        }
      },
      title: {
        text: "Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val).toFixed(0);
        }
      }
    };
  }
  
  getPastData() {
    let code = this.selectedStock.Symbol
    let pastData = []
    let predictedData = []
    this.dataService.getPredictedData(code).subscribe((res) => {
      
      res.res.forEach(data => {
        predictedData.push([Date.parse(data.Date), data.Predictions]);
        pastData.push([Date.parse(data.Date), data.Close]);
      });
      this.isLoaded = true
      this.initChartData(pastData, predictedData);
    })
  }

}
