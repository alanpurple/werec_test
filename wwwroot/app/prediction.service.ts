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
    getUserIndex(id: number, fromDate: Date, toDate: Date): Observable<number> {
        let fromMonth = fromDate.getMonth()+1;
        let fromDay = fromDate.getDate();
        let fromStr = fromMonth > 9 ? fromMonth.toString() : '0' + fromMonth;
        fromStr += fromDay > 0 ? fromDay.toString() : '0' + fromDay;
        let toMonth = toDate.getMonth() + 1;
        let toDay = toDate.getDate();
        let toStr = toMonth > 9 ? toMonth.toString() : '0' + toMonth;
        toStr += toDay > 9 ? toDay.toString : '0' + toDay;
        return this.http.get<number>('/results/user_index/' + id + '/' + fromStr + '/' + toStr);
    }

    getWepickDeals(date: Date, time: number, slot: number): Observable<UserHistoryData[]> {
        let dateStr = date.getFullYear().toString();
        dateStr += '-';
        dateStr += date.getMonth() > 8 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1);
        dateStr += '-';
        dateStr += date.getDate() > 0 ? date.getDate().toString() : '0' + date.getDate();
        dateStr += ' ' + time;
        return this.http.get<UserHistoryData[]>('/results/wepick/' + dateStr + '/' + slot);
    }
}