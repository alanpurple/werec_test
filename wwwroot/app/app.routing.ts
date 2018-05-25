import { Routes, RouterModule } from '@angular/router';

import { Home } from './home';
import { PredictionResults } from './prediction.results';

const appRoutes: Routes = [
    {
        path: '', component: Home
    },
    {
        path: 'prediction-results', component: PredictionResults
    }
];

export const AppRouting = RouterModule.forRoot(appRoutes);