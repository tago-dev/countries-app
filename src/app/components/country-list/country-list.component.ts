import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '../../services/country.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-country-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        PaginatorModule,
        DataViewModule,
        ProgressSpinnerModule
    ],
    templateUrl: './country-list.component.html',
    styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit, OnDestroy {
    countries: any[] = [];
    filteredCountries: any[] = [];
    displayedCountries: any[] = []; // Para paginação
    searchTerm: string = '';
    loading: boolean = true;

    // Paginação
    first: number = 0;
    rows: number = 12;

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private countryService: CountryService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAllCountries();
        this.setupSearchDebounce();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setupSearchDebounce(): void {
        this.searchSubject.pipe(
            takeUntil(this.destroy$),
            debounceTime(300),
            distinctUntilChanged(),
        ).subscribe(() => {
            this.searchCountries();
        });
    }

    onSearchInput(): void {
        this.searchSubject.next(this.searchTerm);
    }

    updateDisplayedCountries() {
        const startIndex = this.first;
        const endIndex = Math.min(startIndex + this.rows, this.filteredCountries.length);
        this.displayedCountries = this.filteredCountries.slice(startIndex, endIndex);
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.updateDisplayedCountries();
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
            this.updateDisplayedCountries();
            this.loading = false;
        });
    }

    searchCountries(): void {
        if (this.searchTerm.trim() === '') {
            this.filteredCountries = this.countries;
            this.first = 0; // Reset to first page
            this.updateDisplayedCountries();
            return;
        }

        this.loading = true;
        const searchTerm = this.searchTerm.toLowerCase();

        // Implement client-side filtering for better UX
        this.filteredCountries = this.countries.filter(country => {
            return country.name.common.toLowerCase().includes(searchTerm) ||
                country.region.toLowerCase().includes(searchTerm) ||
                (country.capital && country.capital[0] &&
                    country.capital[0].toLowerCase().includes(searchTerm));
        });

        this.first = 0; // Reset to first page
        this.updateDisplayedCountries();
        this.loading = false;
    }

    viewCountryDetails(countryCode: string): void {
        this.router.navigate(['/country', countryCode]);
    }
} 