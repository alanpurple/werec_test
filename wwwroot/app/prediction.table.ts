﻿import { Component, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { PredictionData } from './prediction.data';
import { PredictionRequestData } from './prediction.request.data';
import { PredictionResultData } from './prediction.result.data';
import { PredictionService } from './prediction.service';
import { ErrorAlert } from './error.alert';
import { Data } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: './prediction.table.html'
})
export class PredictionTable {
    constructor(private predictionService: PredictionService,
        private errorAlert: ErrorAlert) {
        this.dataSource = new MatTableDataSource();
    }
    private results: PredictionData[] = [];
    private requestData: PredictionRequestData;

    selectedId: number;
    userIds: number[];
    dataSource: MatTableDataSource<PredictionResultData>;
    displayedColumns: string[] = ['id', 'slot', 'score'];
    fromDate: Date;
    toDate: Date;
    minDate: Date = new Date(2018, 2, 1);
    momentValidDate: Date;
    periodFixed: boolean = false;
    methods: any[] = [
        { name: 'DNN using Tensorflow', method: 'dnn_tf' },
        { name: 'DIN model from Alibaba', method: 'alibaba_din' },
        { name: 'Gradient Boosted Tree', method: 'gbc' },
        { name: 'Logistic Regression', method: 'logistic' },
        { name: 'Logistic Regression(tf)', method: 'logistic_tf' },
        { name: 'Gradient Boosted Tree(tf)', method: 'boosted_tree_tf' }
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    getUsers() {
        this.predictionService.getUsers(this.fromDate, this.toDate)
            .subscribe(ids => {
                this.userIds = ids;
                this.momentValidDate = new Date(this.toDate.getFullYear(),
                    this.toDate.getMonth(), this.toDate.getDate() + 1);
                this.requestData = {
                    fromDate: this.fromDate,
                    toDate: this.toDate,
                    predictMoment: this.momentValidDate,
                    user: this.userIds[0],
                    methodName: this.methods[0].method
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
        this.dataSource = new MatTableDataSource();
    }

    getPrediction() {
        console.log('predict');
        this.predictionService.getPrediction(this.requestData)
            .subscribe(results => {
                Array.prototype.push.apply(this.dataSource.data, results);
                this.dataSource.data.slice();
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }, err => this.errorAlert.open(err));
    }
}