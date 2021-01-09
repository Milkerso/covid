import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { CovidService } from "../_services/covid.service";
import regression from 'regression';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  chartData: any[] = [];
  @Input() title: string;
  @Input() country: string;
  growthRate: number = 0;
  isRegressionDone: boolean = false;
  lastData: number;
  predictDay: number = 45;

  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];
  lineChartColors: Color[];
  lineChartOptions: ChartOptions = {
    responsive: true
  }

  constructor(
    public api: CovidService
  ) { }

  ngOnInit(): void {
    let color = this.title === 'Confirmed' ? 'rgba(0, 0, 255, 0.3)' : this.title === 'Deaths' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)';
    this.lineChartColors = [{
      backgroundColor: color
    }]
    this.api.getLiveData(this.country, this.title.toLowerCase())
      .subscribe((data: any[]) => {
        // let filteredData = data.filter(item => item.Cases > 0);
        this.chartData = data.filter(item => item.Cases > 0);
        this.lineChartData = [
          { data: this.chartData.map(c => c.Cases) }
        ];
        this.lineChartLabels = this.chartData.map(c => c.Date.substr(0, 10));
      });
  }

  prediction() {
    let trainData = [];
    for (let i = 0; i < this.chartData.length; i++){
      trainData.push([i, Math.log(this.chartData[i].Cases)]);
   //   console.log(this.chartData[i].Cases);
    }
   // console.log(trainData)
    const result = regression.linear(trainData);
    this.growthRate = Math.exp(result.equation[0]);
    this.isRegressionDone = true;
    this.lastData = this.chartData.slice(-1)[0].Cases;
    console.log(this.lastData);
  }

  getPredictedValue(days: number): string {
    return isNaN(parseInt('' + days)) ? '0' : (this.lastData * (this.growthRate ** days)).toFixed(0);
  }

}
