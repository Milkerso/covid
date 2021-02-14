import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild } from '@angular/core';
import { CovidService } from "../_services/covid.service";
import { MatTableDataSource } from '@angular/material';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart';

export interface PeriodicElement {
  region: string;
  Lp: number;
  infected: number;
  deceased: number;
}
const ELEMENT_DATA: PeriodicElement[] = [{
  Lp: 1, region: "dolnoslaskie", infected: 4513, deceased: 172
}]
@Component({
  selector: 'app-root',
  templateUrl: './covidCharts.component.html',
  styleUrls: ['./covidCharts.component.scss']
})
export class CovidChartsComponent implements OnInit, AfterViewInit {
  constructor(private _covid: CovidService, private changeDetectorRefs: ChangeDetectorRef) {
  }
  private data = [];

  public displayedColumns: string[] = ['Lp', 'region', 'infected', 'deceased'];
  public dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild('myChart', {static: false}) myChart: jqxChartComponent;

  ngAfterViewInit(): void {
    this.generateData();

  }
  ngOnInit() {


    // console.log(this.data);
  }
  mouseOverIndex = -1;

  public onMouseOver(index) {
    // console.log(index)
    this.mouseOverIndex = index;
  }

  generateData(): any[] {
    this._covid.getWojewodztwaData()
      .subscribe(res => {
        while (ELEMENT_DATA.length > 0) {
          ELEMENT_DATA.pop();
        }
        while (this.sampleData.length > 0) {
          this.sampleData.pop();
        }
        for (let i = 0; i < 16; i++) {
          let row = {};
          let globalResult = res['infectedByRegion'].map(res => res.region);
          let globalResult2 = res['infectedByRegion'].map(res => res.infectedCount);
          let globalResult3 = res['infectedByRegion'].map(res => res.deceasedCount);

          ELEMENT_DATA.push({ Lp: i+1, region: globalResult[i], infected: globalResult2[i], deceased: globalResult3[i] });
          this.sampleData.push({ region: globalResult[i], infected: globalResult2[i], deceased: globalResult3[i] });
        }
        ELEMENT_DATA.sort((a, b)  => (a.infected < b.infected) ? 1 : ((b.infected < a.infected) ? -1 : 0));
        for(let i = 0;i <16; i++)
        {
          ELEMENT_DATA[i].Lp=i+1;
        }
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);

       this.sampleData= this.sampleData.sort((a, b)  => (a.infected < b.infected) ? 1 : ((b.infected < a.infected) ? -1 : 0));
       console.log(this.sampleData)

        this.myChart.update();
      });
    return this.data;
  }


  sampleData: any = [
    { region: 'dolnoslaskie', infected: 1000, deceased: 123 },
  ];
  padding: any = { left: 20, top: 0, right: 20, bottom: 0 };
  titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }


    return '90%';
  }

  // xAxis: any =
  // {
  //   dataField: 'region',
  //   gridLines: { visible: true },
  //   flip: false
  // };
  // valueAxis: any =
  //   {
  //     flip: true,
  //     labels: {
  //       visible: true,
  //       formatFunction: (value: string) => {
  //         return parseInt(value) / 1;
  //       }
  //     }
  //   };

    xAxis: any =
    {
      unitInterval: 1,
      gridLines: { visible: true},
      valuesOnTicks: false,
      dataField: 'region',
      textRotationAngle: 25,
      flip:false
    };
  valueAxis: any =
    {
      flip:true,
      title: {text: 'Ilość'},
      labels: {horizontalAlignment: 'right'}
    };
  seriesGroups: any[] =
    [
      {
        type: 'column',
        columnsGapPercent: 50,
        alignEndPointsWithIntervals: true,
        orientation: 'horizontal',
        series: [
          {
            dataField: 'infected',
            displayText: 'Przypadki',
            opacity: 1,
            lineWidth: 1,
            symbolType: 'circle',
            fillColorSymbolSelected: 'white',
            radius: 15
          },
          {
            dataField: 'deceased',
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
}
