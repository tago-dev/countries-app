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
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap, Subject, takeUntil } from 'rxjs';
import { SelectItem } from 'primeng/api';

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
        DropdownModule,
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

    // DataView sorting
    sortOptions: SelectItem[] = [];
    sortField: string = '';
    sortOrder: number = 1;

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private countryService: CountryService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAllCountries();
        this.setupSortOptions();
        this.setupSearchDebounce();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setupSortOptions() {
        this.sortOptions = [
            { label: 'Nome (A-Z)', value: 'name.common' },
            { label: 'Nome (Z-A)', value: '!name.common' },
            { label: 'População (Maior para Menor)', value: '!population' },
            { label: 'População (Menor para Maior)', value: 'population' },
            { label: 'Região', value: 'region' }
        ];

        this.sortField = 'name.common';
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }

        this.sortCountries();
    }

    sortCountries() {
        this.filteredCountries.sort((a, b) => {
            let result = 0;
            const field = this.sortField;

            // Função recursiva para obter valores aninhados como 'name.common'
            const getValue = (obj: any, path: string) => {
                const parts = path.split('.');
                let current = obj;
                for (const part of parts) {
                    if (current[part] === undefined) return null;
                    current = current[part];
                }
                return current;
            };

            const valueA = getValue(a, field);
            const valueB = getValue(b, field);

            if (valueA === null && valueB === null) result = 0;
            else if (valueA === null) result = -1;
            else if (valueB === null) result = 1;
            else if (typeof valueA === 'string' && typeof valueB === 'string') {
                result = valueA.localeCompare(valueB);
            } else {
                result = (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
            }

            return this.sortOrder * result;
        });

        this.updateDisplayedCountries();
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
            this.sortCountries();
            this.loading = false;
        });
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

    searchCountries(): void {
        if (this.searchTerm.trim() === '') {
            this.filteredCountries = this.countries;
            this.first = 0; // Reset to first page
            this.sortCountries();
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
        this.sortCountries();
        this.loading = false;
    }

    viewCountryDetails(countryCode: string): void {
        this.router.navigate(['/country', countryCode]);
    }
} 