import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormServiceService {

  // setup URL for countries and states
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  // inject HttpClient for rest calls
  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{

    // search states url 
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}` 

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    
    let data: number[] = [];

    // build and array for "Month" dropdown list
    // - start at current month and loop until 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data); // the "of" operator from rxjs will wrap an object as an Observable
  }

  getCreditCardYears(): Observable<number[]>{

    let data: number[] = [];

    // build and array for "year" dropdown list
    // - start ar current year and loop for next 10 years

    const startYear: number = new Date().getFullYear(); // get the current year
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data); // the "of" operator from rxjs will wrap an object as an Observable
  }
  
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  } 
}