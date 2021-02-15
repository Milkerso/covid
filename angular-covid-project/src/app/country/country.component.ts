import { Component, OnInit } from '@angular/core';
import { CovidService } from '../_services/covid.service';
import { MatInputModule } from '@angular/material/input';
import { isBuffer } from 'util';
@Component({
  selector: 'app-dashboard',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  pageNumber: number = 0;
  asOnDate: Date = undefined;

  constructor(
    private api: CovidService
  ) { }

  displayItems: any[] = [];
  countriesSummary: any[] = [];
  displayedColumns = ['no', 'country', 'confirmed', 'deaths', 'recovered']
  totalCases: number = 0;
  totalDeaths: number = 0;
  totalRecovered: number = 0;

  ngOnInit(): void {
    if (!this.api.isSummaryLoaded) {
      this.api.getSummary()
        .subscribe(data => {
          this.asOnDate = data.Date;
          let countries = this.removeDuplicateEntries(data.Countries);
          countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
          this.api.countriesSummary = countries;
          this.countriesSummary = countries;
          this.displayItems = this.countriesSummary.slice(0, 10);
          this.api.isSummaryLoaded = true;
          this.api.asOnDate = this.asOnDate;
        })
    } else {
      this.countriesSummary = this.api.countriesSummary;
      this.displayItems = this.countriesSummary.slice(0, 10);
      this.calculateSummary(this.countriesSummary);
      this.asOnDate = this.api.asOnDate;
    }
  }

  getTotal(column: string): number {
    let fieldName = column == 'confirmed' ? 'TotalConfirmed' : column == 'deaths' ? 'TotalDeaths' : 'TotalRecovered';
    return this.countriesSummary.map(c => c[fieldName]).reduce((acc, value) => acc + value, 0);
  }

  pageChange(page) {
    let start = page.pageIndex * page.pageSize;
    this.pageNumber = page.pageIndex;
    this.displayItems = this.countriesSummary.slice(start, start + page.pageSize);
  }

  applyFilter(filterValue: string) {
    this.countriesSummary = this.api.countriesSummary;
    if (filterValue.length == 0) {
      this.countriesSummary = this.api.countriesSummary;
      this.displayItems = this.countriesSummary.slice(0, 10);
      this.pageNumber = 0
    }
    else {
      this.countriesSummary = this.countriesSummary.filter(it => {
        return it.Country.toLowerCase().includes(filterValue.toLowerCase());
      });
      this.displayItems = this.countriesSummary.slice(0, 10);
      this.pageNumber = 0
    }

  }
  keydown(filterValue: string) {
    if (filterValue.length == 0) {
      this.countriesSummary = this.api.countriesSummary;
      this.displayItems = this.countriesSummary.slice(0, 10);
      this.pageNumber = 0
    }
    else {
      this.countriesSummary = this.api.countriesSummary;
      this.countriesSummary = this.countriesSummary.filter(it => {
        return it.Country.toLowerCase().includes(filterValue.toLowerCase());
      });
      this.displayItems = this.countriesSummary.slice(0, 10);
      this.pageNumber = 0
    }

  }

  removeDuplicateEntries(source: any[]): any[] {
    let slugs = [];
    let filteredData = [];
    source.map(t => {
      if (!slugs.includes(t.Slug) &&
        t.Slug !== "" &&
        (t.TotalConfirmed !== 0 ||
          t.TotalDeaths !== 0 ||
          t.TotalRecovered !== 0)) {
        filteredData.push(t);
        slugs.push(t.Slug);
      }
    })
    this.calculateSummary(filteredData);
    return filteredData;
  }

  calculateSummary(source: any[]): void {
    this.totalCases = source.map(d => d.TotalConfirmed).reduce((arr, val) => arr + val, 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    this.totalDeaths = source.map(d => d.TotalDeaths).reduce((arr, val) => arr + val, 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    this.totalRecovered = source.map(d => d.TotalRecovered).reduce((arr, val) => arr + val, 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

}
