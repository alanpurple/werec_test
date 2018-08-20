import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PredictionRequestData } from './prediction.request.data';
import { PredictionResultData } from './prediction.result.data';
import { UserHistoryData } from './user.history.data';

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
    getUserHistory(id: number, slot: number, limit: number): Observable<UserHistoryData[]> {
        return this.http.get<UserHistoryData[]>('/results/hist/' + id + '/slot/' + slot + '/limit/' + limit);
    }
}