import { Component, OnInit } from '@angular/core';
import {CovidService} from '../_services/covid.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {

  countryName: string = 'Country';
  countrySlug: string = '';
  confirmed: any[] = [];
  confirmedRecord: any = {};
  confirmedLoading: boolean = true;
  deaths: any[] = [];
  deathsRecord: any = {};
  deathsLoading: boolean = true;
  recovered: any[] = [];
  recoveredRecord: any = {};
  recoveredLoading: boolean = true;
  summaryRecord: any = {};

  constructor(
    private api: CovidService,
    private router: ActivatedRoute
  ) { 
    this.countrySlug = this.router.snapshot.params.slug;
    this.countryName = this.countrySlug;
  }

  ngOnInit(): void {
    this.api.getLiveDataForCountry(this.countrySlug)
      .subscribe(data => {
        this.countryName = data[0].Country;
        this.confirmedRecord = this.groupBy(data).slice(-1)[0];
        this.summaryRecord.Confirmed = this.confirmedRecord.Confirmed;
        this.summaryRecord.Deaths = this.confirmedRecord.Deaths;
        this.summaryRecord.Recovered = this.confirmedRecord.Recovered;
        this.summaryRecord.Date = this.confirmedRecord.Date;
        this.confirmedLoading = false;
      }, error => {})
  }

  groupBy(data: any[]): any[] {
    return data.reduce(function(res, obj) {
        if (!(obj.Date in res))
            res.__array.push(res[obj.Date] = obj);
        else {
            res[obj.Date].Confirmed += obj.Confirmed;
            res[obj.Date].Deaths += obj.Deaths;
            res[obj.Date].Recovered += obj.Recovered;
            res[obj.Date].Active += obj.Active;
        }
        return res;
    }, {__array:[]}).__array
                    .sort(function(a,b) { return a.Date - b.Date; });
    }

}
