import { Component, OnInit } from '@angular/core';
import { CovidService } from "../_services/covid.service";
import regression from 'regression';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  isRegressionDone: boolean = false;
  lastData: number;
  predictDay: number = 45;
  growthRate: number = 0;

  constructor(private _covid: CovidService) { }

  ngOnInit() {
    this._covid.getSimulation()
      .subscribe(res => {
      });
    let date3 = 0;
    let date4 = 0;
    let date5 = 0;
    let date6;
    let date7;
    let date8;
    var maxDate = 0;
    let date9;
    let data10 = [];
    this._covid.getWorldData()
      .subscribe(res => {
        for (let i = 0; i < res['count']; i++) {
          let date1 = res['result'];

          let date2 = Object.keys(date1)
          let date3 = date1[date2[i]]
          date9 = date3["confirmed"];
          data10.push(date9);
          date4 = date3["deaths"];
          date5 = date3["recovered"];
          date6 = date2[i];

          date7 = new Date(date6);
          let month = date7.getMonth() + 1;
          date8 = (date7.getDate() + "/" + month).toString();
          if (date9 > maxDate) {
            maxDate = date3;
          }
          if (date4 > maxDate) {
            maxDate = date4;
          }
          if (date5 > maxDate) {
            maxDate = date5;
          }
        }
        let trainData = [];
        for (let i = 0; i < res['count']; i++) {
          trainData.push([i, Math.log(data10[i])]);
        }
        const result = regression.linear(trainData);
        this.growthRate = Math.exp(result.equation[0]);
        this.isRegressionDone = true;
        this.lastData = date9;
      })
  }
  precision() {

  }
  getPredictedValue(days: number): string {
    return isNaN(parseInt('' + days)) ? '0' : (this.lastData * (this.growthRate ** days)).toFixed(0);
  }
}
