import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { jqxChartModule } from 'jqwidgets-ng/jqxchart';
import { jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { CovidService } from "./_services/covid.service";
import { CovidChartsComponent } from "./covidCharts/covidCharts.component";
import { TableListComponent } from "./table-list/table-list.component";
import { jqxDataTableModule } from "jqwidgets-ng/jqxdatatable";
import { LiveComponent } from "./live/live.component";
import { ChartComponent } from "./chart/chart.component";
import { CountryComponent } from "./country/country.component";


import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StatisticsComponent,
    CovidChartsComponent,
    TableListComponent,
    LiveComponent,
    ChartComponent,
    CountryComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    jqxChartModule,
    jqxDropDownListModule,
    jqxDataTableModule,
    ToastrModule.forRoot()
  ],
  providers: [CovidService],
  bootstrap: [AppComponent],
  exports:
    [
      MatTableModule
    ]
})
export class AppModule { }
