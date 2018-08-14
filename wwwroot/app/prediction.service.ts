import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorAlert } from './error.alert';

import { PredictionRequestData } from './prediction.request.data';
import { PredictionResultData } from './prediction.result.data';

@Injectable()
export class PredictionService {
    constructor(private http: HttpClient) { }
    getUsers(fromDate: Date, toDate: Date): Observable<number[]> {
        return this.http.post<number[]>('/results/user_profile', { dayFrom: fromDate,dayTo: toDate });
    }
    getPrediction(data: PredictionRequestData): Observable<PredictionResultData[]> {
        return this.http.post<PredictionResultData[]>('/results/predict', data);
    }
    getMfPrediction(data: PredictionRequestData): Observable<PredictionResultData[]> {
        return this.http.post<PredictionResultData[]>('/results/predict', data);
    }
    getUserHistory(id: number): Observable<string[]> {
        return this.http.get<string[]>('/results/hist/' + id);
    }
}