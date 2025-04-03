import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private apiUrl = 'https://restcountries.com/v3.1';

    constructor(private http: HttpClient) { }

    getAllCountries(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }

    searchCountries(term: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/name/${term}`);
    }

    getCountryByCode(code: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/alpha/${code}`);
    }
} 