import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { CovidChartsComponent } from "./covidCharts/covidCharts.component";
import { TableListComponent } from "./table-list/table-list.component";
import { LiveComponent } from './live/live.component';
import { CountryComponent } from './country/country.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dash', component: DashboardComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'wojewodztwa', component: CovidChartsComponent },
  { path: 'table', component: TableListComponent },
  { path: 'live/:slug', component: LiveComponent },
  { path: 'countries', component: CountryComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
