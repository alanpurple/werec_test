import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { PredictionData } from './prediction.data';
import { PredictionRequestData } from './prediction.request.data';
import { PredictionService } from './prediction.service';
import { DealInfoService } from './dealinfo.service';
import { ErrorAlert } from './error.alert';

@Component({
    moduleId: module.id,
    templateUrl: './prediction.table.html'
})
export class PredictionTable {
    constructor(
        private predictionService: PredictionService,
        private dealInfoService: DealInfoService,
        private errorAlert: ErrorAlert) {
        this.dataSource = new MatTableDataSource();
    }
    private results: PredictionData[] = [];
    private requestData: PredictionRequestData;

    selectedId: number;
    userIds: number[];
    dataSource: MatTableDataSource<{}>;
    displayedColumns: string[] = ['id', 'slot', 'title', 'score','category'];
    isProcessing: boolean = false;
    isRetrievingUsers: boolean = false;
    fromDate: Date;
    toDate: Date;
    minDate: Date = new Date(2018, 2, 1);
    momentValidDate: Date;
    periodFixed: boolean = false;
    methods: any[] = [
        { name: 'DNN using Tensorflow', method: 'dnn_tf' },
        { name: 'DIN model by Alibaba', method: 'alibaba_din' },
        { name: 'Gradient Boosted Tree', method: 'gbc' },
        { name: 'Logistic Regression', method: 'logistic' },
        { name: 'Logistic Regression(tf)', method: 'logistic_tf' },
        { name: 'Gradient Boosted Tree(tf)', method: 'boosted_tree_tf' },
        { name: 'RNN', method: 'rnn' },
        { name: 'Bidirectional RNN', method: 'rnn_bi' },
        { name: 'Weighted ALS', method: 'wals' }
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    getUsers() {
        this.isRetrievingUsers = true;
        this.predictionService.getUsers(this.fromDate, this.toDate)
            .subscribe(ids => {
                this.isRetrievingUsers = false;
                this.userIds = ids;
                this.momentValidDate = new Date(this.toDate.getFullYear(),
                    this.toDate.getMonth(), this.toDate.getDate() + 1);
                this.requestData = {
                    fromDate: this.fromDate,
                    toDate: this.toDate,
                    predictMoment: this.momentValidDate,
                    user: this.userIds[0],
                    methodName: this.methods[0].method,
                    // default values for wals, unnecessary for other methods
                    dimension: 13,
                    weight: 0.5,
                    coef: 2.0,
                    nIter: 10
                };
                this.periodFixed = true;
            },
                err => this.errorAlert.open(err));
    }

    selectUser(id) {
        this.requestData.user = id;
    }

    resetPeriod() {
        this.requestData.user = null;
        this.dataSource.data = [];
    }

    getPrediction() {
        this.isProcessing = true;
        this.dataSource.data = [];
        this.predictionService.getPrediction(this.requestData)
            .subscribe(results => {
                this.isProcessing = false;
                Array.prototype.push.apply(this.dataSource.data, results);
                this.dataSource.data.slice();
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                
            }, err => this.errorAlert.open(err));
    }
}