import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


const API_URL = 'http://localhost:8082/covid/POL';
const API_URL_GLOBAL = 'http://localhost:8082/covid/global';
const API_URL_WOJEWODZTWA = 'http://localhost:8082/covid/wojewodztwo';
const API_URL_ALL_COUNTRY = 'http://localhost:8082/covid/allCountry';
const API_URL_WORLD = 'http://localhost:8082/covid/global/count';
const API_URL_SIMULATION = 'http://localhost:8082/covid/simulation';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CovidService {
  isSummaryLoaded: boolean = false;
  countriesSummary: any[] = [];
  asOnDate: Date = undefined;
  constructor(private http: HttpClient) { }

  getCountryData() {
    return this.http.get(API_URL, {responseType: 'json'});
  }
  getWorldData() {
    return this.http.get(API_URL_WORLD, {responseType: 'json'});
  }

  getGlobalData() {
    return this.http.get(API_URL_GLOBAL, {responseType: 'json'});
  }
  getGlobalDataForAllCountry() {
    return this.http.get(API_URL_ALL_COUNTRY, {responseType: 'json'});
  }

  getWojewodztwaData() {
    return this.http.get(API_URL_WOJEWODZTWA, {responseType: 'json'});
  }
  getSimulation()
  {
    return this.http.get(API_URL_SIMULATION, {responseType: 'json'});
  }
  getSummary(): Observable<any> {
    return this.http.get('https://api.covid19api.com/summary');
  }

  getLiveData(country: string, status: string): Observable<any> {
    return this.http.get(`https://api.covid19api.com/total/country/${country}/status/${status}`);
  }
  getLiveDataForCountry(country: string): Observable<any> {
    return this.http.get(`https://api.covid19api.com/total/country/${country}`);
  }
  getCurrentData(country: string, status: string): Observable<any> {
    let todayData = new Date();
    todayData.setDate(todayData.getDate() -2);
    let date = todayData.toISOString().substr(0, 10) + "T23:59:59Z";
    return this.http.get(`https://api.covid19api.com/live/country/${country}/status/${status}/date/${date}`);
  }
}
