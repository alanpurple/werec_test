import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorAlert } from './error.alert';

import { DealData } from './deal.data';

@Injectable()
export class DealInfoService {
    constructor(private http: HttpClient, private errorAlert: ErrorAlert) {
    }
    getResults(name: string): Observable<DealData[]> {
        return this.http.get<DealData[]>('/results/' + name);
    }

    getSingleResult(id: number): Observable<DealData> {
        return this.http.get<DealData>('/results/single/' + id);
    }
}