import { Routes, RouterModule } from '@angular/router';

import { Home } from './home';
import { PredictionResults } from './prediction.results';
import { PredictionTable } from './prediction.table';
import { HistoryViewer } from './history-viewer';

const appRoutes: Routes = [
    {
        path: '', component: Home
    },
    {
        path: 'prediction-results', component: PredictionResults
    },
    {
        path: 'prediction-table', component: PredictionTable
    },
    {
        path: 'history-viewer', component: HistoryViewer
    }
];

export const AppRouting = RouterModule.forRoot(appRoutes);