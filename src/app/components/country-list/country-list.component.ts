import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-country-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        PaginatorModule
    ],
    templateUrl: './country-list.component.html',
    styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
    countries: any[] = [];
    filteredCountries: any[] = [];
    searchTerm: string = '';
    loading: boolean = true;

    constructor(
        private countryService: CountryService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAllCountries();
    }

    loadAllCountries(): void {
        this.loading = true;
        this.countryService.getAllCountries().pipe(
            catchError(error => {
                console.error('Error fetching countries', error);
                this.loading = false;
                return of([]);
            })
        ).subscribe(data => {
            this.countries = data;
            this.filteredCountries = data;
            this.loading = false;
        });
    }

    searchCountries(): void {
        if (this.searchTerm.trim() === '') {
            this.filteredCountries = this.countries;
            return;
        }

        this.loading = true;
        this.countryService.searchCountries(this.searchTerm).pipe(
            catchError(error => {
                console.error('Error searching countries', error);
                this.loading = false;
                return of([]);
            })
        ).subscribe(data => {
            this.filteredCountries = data;
            this.loading = false;
        });
    }

    viewCountryDetails(countryCode: string): void {
        this.router.navigate(['/country', countryCode]);
    }
} 