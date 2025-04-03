import { Routes } from '@angular/router';
import { CountryListComponent } from './components/country-list/country-list.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';

export const routes: Routes = [
    { path: '', component: CountryListComponent },
    { path: 'country/:code', component: CountryDetailComponent },
    { path: '**', redirectTo: '' }
];
