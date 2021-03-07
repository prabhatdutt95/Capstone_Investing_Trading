import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { CandlestickChartComponent } from './charts/candlestick-chart/candlestick-chart.component';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        LineChartComponent,
        CandlestickChartComponent
    ],
    imports: [
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        AppRoutingModule,
        NgApexchartsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
