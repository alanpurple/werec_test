import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Client, SearchResponse } from 'elasticsearch';
import { ErrorAlert } from './error.alert';

import { DealData } from './deal.data';

@Injectable()
export class DealInfoService {
    private client: Client
    constructor(private http: HttpClient, private errorAlert: ErrorAlert) {
        this.client = new Client({
            host: '10.102.50.47:9200',
            log: 'trace'
        });
    }

    getItem(id: number): Promise<SearchResponse<{}>> {
        return this.client.search({
            index: 'ojm4',
            filterPath: ['hits.hits._source'],
            body: {
                'query': {
                    'ids': {
                        'values': [id]
                    }
                }
            }
        });
    }

    getResults(name: string): Observable<DealData[]> {
        return this.http.get<DealData[]>('/results/' + name);
    }

    getSingleResult(id: number): Observable<DealData> {
        return this.http.get<DealData>('/results/single/' + id);
    }
}