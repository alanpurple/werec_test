import { Routes, RouterModule } from '@angular/router';

import { Home } from './home';
import { PredictionResults } from './prediction.results';
import { PredictionTable } from './prediction.table';

const appRoutes: Routes = [
    {
        path: '', component: Home
    },
    {
        path: 'prediction-results', component: PredictionResults
    },
    {
        path: 'prediction-table', component: PredictionTable
    }
];

export const AppRouting = RouterModule.forRoot(appRoutes);