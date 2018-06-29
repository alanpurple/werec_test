import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorAlert } from './error.alert';

import { PredictionRequestData } from './prediction.request.data';

@Injectable()
export class PredictionService {
    constructor(private http: HttpClient) { }
    getUsers(fromDate: Date, toDate: Date): Observable<number[]> {
        return this.http.post<number[]>('/results/user_profile', { fromDate: fromDate, toDate: toDate });
    }
    getPrediction(data: PredictionRequestData): Observable<{}[]> {
        return this.http.post<{}[]>('/results/predict', data);
    }
}