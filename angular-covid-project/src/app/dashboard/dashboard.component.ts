import { OnInit, Component, ViewChild} from '@angular/core';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart';
import { CovidService } from '../_services/covid.service';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{
  constructor(private _covid: CovidService) {
  }
  public confirmed;
  public recovered;
  public deaths;
  gridLinesColor = 'black';
  @ViewChild('myChart', { static: false }) myChart: jqxChartComponent;

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }

    return '95%';
  }

  ngOnInit(): void {
    let date3 = 0;
    let date4 = 0;
    let date5 = 0;
    let date6;
    let date7;
    let date8;
    var maxDate = 0;
    this._covid.getCountryData()
      .subscribe(res => {
        console.log(res);
        console.log( this.legendLayout)
        let countResult = res['count'];
        this.data.pop();
        for (let i = 0; i < 30; i++) {
          let date = res['result'];
          let date1 = Object.keys(date)[i].toString();
          let date2 = date[date1];
          date3 = date2["confirmed"];
          date4 = date2["deaths"];
          date5 = date2["recovered"];
          date6 = date2["date"];
          if (date3 > maxDate) {
            maxDate = date3;
          }
          if (date4 > maxDate) {
            maxDate = date4;
          }
          if (date5 > maxDate) {
            maxDate = date5;
          }
          date7 = new Date(date6);
          let month = date7.getMonth() + 1;
          date8 = (date7.getDate() + "/" + month).toString();
          // data[i].a = date2;
          this.data.push({ Dzień: date8, b: date3, c: date4, d: date5 });
          // data[i].b = date3;
          // data[i].c = date4;
          // data[i].d = date5;

        }
        this.deaths = date4.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        this.confirmed = date3.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        this.recovered = date5.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
        this.valueAxis.maxValue = maxDate;
        this.myChart.update();
      })
  }


  data: any[] = [];
  padding: any = { left: 0, top: 0, right: 250, bottom: 0 };
  titlePadding: any = { left: 250, top: 0, right: 0, bottom: 20 };
  xAxis: any =
    {
      tickMarksColor:this.gridLinesColor,
      title:{ text: 'Dni'},
      titlePadding:{left: 250, top: 0, right: 0, bottom: 0 },
      unitInterval: 1,
      gridLines: {
        interval: 1,
        color: 'this.gridLinesColor'
      },
      valuesOnTicks: false,
      dataField: 'Dzień',
      textRotationAngle: 25,
    };
  valueAxis: any =
    {
      tickMarksColor:this.gridLinesColor,
      gridLines: {
        color: this.gridLinesColor
      },
      title: { text: 'Liczba przypadków' },
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
            lineWidth: 1.5,
            fillColorSymbolSelected: 'white',
            radius: 15
          },
          {
            dataField: 'd',
            displayText: 'Wyleczone',
            opacity: 1,
            lineWidth: 1.5,
            fillColorSymbolSelected: 'white',
            radius: 15
          },
          {
            dataField: 'c',
            displayText: 'Zgony',
            opacity: 1,
            lineWidth: 1.5,
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
    console.log(this.valueAxis.maxValue + 'asadadaasdasadad');
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
  legendLayout:any = {
    left: document.body.offsetWidth - 200,
    top: document.body.offsetHeight * 0.15,
    width:100,
    height:100,
    flow:'vertical'
  }
}
