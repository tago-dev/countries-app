import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../services/country.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { catchError, of } from 'rxjs';

@Component({
    selector: 'app-country-detail',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        PanelModule,
        ProgressSpinnerModule
    ],
    templateUrl: './country-detail.component.html',
    styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
    country: any = null;
    loading: boolean = true;
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private countryService: CountryService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const countryCode = params.get('code');
            if (countryCode) {
                this.getCountryDetails(countryCode);
            } else {
                this.errorMessage = 'Country code not provided';
                this.loading = false;
            }
        });
    }

    getCountryDetails(code: string): void {
        this.loading = true;
        this.countryService.getCountryByCode(code).pipe(
            catchError(error => {
                console.error('Error fetching country details', error);
                this.errorMessage = 'Failed to load country details';
                this.loading = false;
                return of([]);
            })
        ).subscribe(data => {
            if (data && data.length > 0) {
                this.country = data[0];
            } else {
                this.errorMessage = 'Country not found';
            }
            this.loading = false;
        });
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    getLanguages(languages: any): string {
        if (!languages) return 'N/A';
        return Object.values(languages).join(', ');
    }

    getCurrencies(currencies: any): string {
        if (!currencies) return 'N/A';
        return Object.values(currencies)
            .map((currency: any) => `${currency.name} (${currency.symbol})`)
            .join(', ');
    }
} 