import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorAlert } from './error.alert';

import { ImportRequestData } from './import.request.data';

@Injectable()
export class DataService {
    constructor(private http: HttpClient) {}

    ImportDayHistory(requestData: ImportRequestData): Observable<string> {
        return this.http.post<string>('/import/hist', requestData);
    }
}