import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CovidService } from "../_services/covid.service";
import { jqxChartComponent } from "jqwidgets-ng/jqxchart";
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import regression from 'regression';

export interface PeriodicElement {
  Lp: number;
  region: string;
  infected: number;
  deceased: number;
  deaths: number;
}
const ELEMENT_DATA: PeriodicElement[] = [{
  Lp: 1, region: "dolnoslaskie", infected: 4513, deceased: 172,deaths: 123
}]
@Component({
  selector: 'app-root',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements AfterViewInit, OnInit {
  private globalCon: bigint;
  private globalDeaths: bigint;
  private globalRecovered: bigint;
  isRegressionDone: boolean = false;
  lastData: number;
  predictDay: number = 45;
  growthRate: number = 0;
  growthRate1: number = 0;
  growthRate2: number = 0;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);  constructor(private _covid: CovidService) { }
  displayedColumns: string[] = ['Lp','region', 'infected','deceased','deaths'];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;



  @ViewChild('secondChart', { static: false }) secondChart: jqxChartComponent;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    let data1 = this.secondChart.source();
    this._covid.getGlobalData()
      .subscribe(res => {
        let globalResult = res['result'];

        this.globalCon = globalResult['confirmed'];
        this.globalDeaths = globalResult['deaths'];
        this.globalRecovered = globalResult['recovered'];

        data1[0].value = globalResult['confirmed'];;
        data1[1].value = globalResult['recovered'];
        this.secondChart.update();
      })
  }
  ngOnInit() {
    this.getDataForCountry();
    this._covid.getGlobalDataForAllCountry()
    .subscribe(res => {
      let globalResult = res['result'];
      ELEMENT_DATA.pop();
      for(let i=0;i<globalResult.length;i++)
      {
        let date1 = globalResult[i];
        let date2 = Object.keys(date1)
        // let date2 = Object.keys(date1.toString());
        // let date3 = date1[date2];
        // let date4 = date3["confirmed"];

        let date3 = date1[date2[0]];
        ELEMENT_DATA.push({ Lp: i, region: date2[0], infected: date3.confirmed, deceased: date3.recovered ,deaths: date3.deaths})

      }
      ELEMENT_DATA.sort((a, b)  => (a.infected < b.infected) ? 1 : ((b.infected < a.infected) ? -1 : 0));
        for(let i = 0;i <globalResult.length; i++)
        {
          ELEMENT_DATA[i].Lp=i+1;
        }
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;

    });


  }
  data1: any[] =
    [
      { text: 'Confirmed', value: 50 },
      { text: 'Recovered', value: 50 }
    ];
  padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
  titlePadding: any = { left: 5, top: 5, right: 5, bottom: 5 };
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }

    return 850;
  }

  secondSeriesGroup: any[] =
    [
      {
        type: 'donut',
        useGradientColors: true,
        series:
          [
            {
              showLabels: true,
              enableSelection: true,
              displayText: 'text',
              dataField: 'value',
              labelRadius: 120,
              initialAngle: 90,
              radius: 60,
              innerRadius: 50,
              centerOffset: 0
            }
          ]
      }
    ];
  counter: number = 0;
  drawBefore = (renderer: any, rect: any): void => {
    let value;
    if (this.counter === 0) {
      value = this.data1[0].value;
    }
    let sz = renderer.measureText(value, 0, { 'class': 'chart-inner-text' });
    renderer.text(
      value,
      rect.x + (rect.width - sz.width) / 2,
      rect.y + rect.height / 2,
      0,
      0,
      0,
      { 'class': 'chart-inner-text' }
    );
    this.counter++;
  }

  xAxis: any =
  {
    unitInterval: 1,
    gridLines: {interval: 2},
    valuesOnTicks: false,
    dataField: 'Day',
    textRotationAngle: 25,

  };
valueAxis: any =
  {
    minValue: 0,
    maxValue: 70000,
    title: {text: 'Ilość'},
    labels: {horizontalAlignment: 'right'}
  };

  seriesGroups: any[] =
    [
      {
        type: 'column',
        columnsGapPercent: 50,
        alignEndPointsWithIntervals: true,
        series: [
          {
            dataField: 'b',
            displayText: 'Potwierdzone',
            opacity: 1,
            lineWidth: 1,
            symbolType: 'circle',
            fillColorSymbolSelected: 'white',
            radius: 15
          },
          {
            dataField: 'd',
            displayText: 'Wyleczone',
            opacity: 1,
            lineWidth: 1,
            symbolType: 'circle',
            fillColorSymbolSelected: 'white',
            radius: 15
          },
          {
            dataField: 'c',
            displayText: 'Zgony',
            opacity: 1,
            lineWidth: 1,
            symbolType: 'circle',
            fillColorSymbolSelected: 'white',
            radius: 15
          }
        ]
      }
    ];
    colorsSchemesList: string[] = ['scheme01', 'scheme02', 'scheme03', 'scheme04', 'scheme05', 'scheme06', 'scheme07', 'scheme08'];
    seriesList: string[] = ['splinearea', 'spline', 'column', 'scatter', 'stackedcolumn', 'stackedsplinearea', 'stackedspline'];
    colorsOnChange(event: any): void {
      let value = event.args.item.value;
      this.myChart.colorScheme(value);
      this.myChart.update();
    }
    seriesOnChange(event: any): void {
      let args = event.args;
      if (args) {
        let value = args.item.value;
        let isLine = value.indexOf('line') != -1;
        let isArea = value.indexOf('area') != -1;
        let group = this.myChart.seriesGroups()[0];
        group.series[0].opacity = group.series[1].opacity = isArea ? 0.7 : 1;
        group.series[0].lineWidth = group.series[1].lineWidth = isLine ? 2 : 1;
        group.type = value;
        this.myChart.update();
      }
    }
    data: any[] = [
      {Day: "karol", b: 100, c: 200, d: 1}
    ];
    public confirmed;
    public recovered;
    public deaths;
    @ViewChild('myChart', {static: false}) myChart: jqxChartComponent;

    getDataForCountry()
    {
      let date3 = 0;
    let date4 = 0;
    let date5 = 0;
    let date6;
    let date7;
    let date8;
    var maxDate = 0;
    let date9;
    let data10=[];
    this._covid.getWorldData()
      .subscribe(res => {
        console.log(res);
        this.data.pop();
        for (let i = res['count']-30; i < res['count']; i++) {
          let date1 = res['result'];
          let date2 = Object.keys(date1)
          let date3 = date1[date2[i]]
          date9 = date3["confirmed"];

          date4 = date3["deaths"];
          data10.push(date9);

          date5 = date3["recovered"];
          date6 = date2[i];

          date7 = new Date(date6);
          let month = date7.getMonth()+1;
          date8 = (date7.getDate()+"/"+month).toString();
          this.data.push({Day: date8, b: date9, c: date4, d: date5});
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
        this.deaths=date4.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        this.confirmed=date9.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        this.recovered=date5.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        this.valueAxis.maxValue = maxDate;
        this.myChart.update();
        let trainData = [];
        let trainData1 = [];
        let trainData2 = [];

        let data11=[]
        let data12=[]
        for (let i = 0; i < res['count']; i++){
          let date1 = res['result'];

          let date2 = Object.keys(date1)
          let date3 = date1[date2[i]]
          date9 = date3["confirmed"];

          date4 = date3["deaths"];
          data10.push(date9);
          date5 = date3["recovered"];
          data11.push(date5)
          data12.push(date4)

          trainData.push([i, Math.log(data10[i])]);
          trainData1.push([i, Math.log(data11[i])]);
          trainData2.push([i, Math.log(data11[i])]);

          console.log(i);
          console.log(data10[i]);
        }
        console.log(trainData)
        const result = regression.linear(trainData);
        const result1 = regression.linear(trainData1);
        const result2 = regression.linear(trainData2);

        this.growthRate = Math.exp(result.equation[0]);
        this.growthRate1 = Math.exp(result1.equation[0]);
        this.growthRate2 = Math.exp(result2.equation[0]);

        this.isRegressionDone = true;
        this.lastData = date9;


        console.log(this.lastData)
        console.log(this.growthRate)
        console.log(this.getPredictedValue(1));
          })
        }
        precision(){

        }
        getPredictedValue(days: number): string {
          return isNaN(parseInt('' + days)) ? '0' : (this.lastData * (this.growthRate ** days)).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }
        getPredictedValue1(days: number): string {
          return isNaN(parseInt('' + days)) ? '0' : (this.recovered * (this.growthRate1 ** days)).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }
        getPredictedValue2(days: number): string {
          return isNaN(parseInt('' + days)) ? '0' : (this.deaths * (this.growthRate2 ** days)).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        }
}
