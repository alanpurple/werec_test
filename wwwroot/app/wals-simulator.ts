import { Component, ViewChild,OnInit } from '@angular/core';
import {
    MatPaginator, MatSort, MatTableDataSource,
    MatDialog, MatDialogRef
} from '@angular/material';

import { PredictionData } from './prediction.data';
import { PredictionRequestData } from './prediction.request.data';
import { PredictionService } from './prediction.service';
import { DealInfoService } from './dealinfo.service';
import { ErrorAlert } from './error.alert';
import { ConfirmDialog } from './confirm.dialog';
import { MfRequestData } from './mf.request.data';
import { PredictionResultData } from './prediction.result.data';

@Component({
    moduleId: module.id,
    templateUrl: './wals-simulator.html'
})
export class WalsSimulator implements OnInit {
    constructor(
        private idDialog: MatDialog,
        private predictionService: PredictionService,
        private dealInfoService: DealInfoService,
        private errorAlert: ErrorAlert,
        private confirmDialog: ConfirmDialog
    ) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit() {
        this.predictionService.getCateDict().subscribe(
            data => this.cateDict = data,
            err => this.errorAlert.open(err)
        );

        // temporarily fix prediction date to 4/11 and automatically retrieve on init
        this.predictionService.getWepickDeals(this.requestData.predictMoment, 21, 20)
            .subscribe(data => {
                this.predictionResults = data;
                this.dataSource = new MatTableDataSource(this.predictionResults);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
                err => this.errorAlert.open(err));
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private predictionResults: PredictionResultData[] = [];
    private results: PredictionData[] = [];
    private requestData: PredictionRequestData = {
        fromDate: new Date(2018, 2, 11),
        toDate: new Date(2018, 3, 10),
        user:0,
        methodName: 'wals',
        predictMoment: new Date(2018, 3, 11),
        dimension: 10,
        weight: 0.5,
        coef: 2.0,
        nIter: 1
    };
    private isProcessing: boolean = false;
    dataSource: MatTableDataSource<PredictionResultData>;
    displayedColumns: string[] = ['id', 'slot', 'title', 'score', 'category'];
    selectedId: number;
    userId: number;
    userFileName: string;
    itemFileName: string;
    cateDict: number[];

    checkUserId() {
        this.predictionService.getUserIndex(this.userId, this.requestData.fromDate, this.requestData.toDate)
            .subscribe(id => {
                this.idDialog.open(IdConfirmDialog)
                    .afterClosed().subscribe(selected => {
                        if (selected)
                            this.selectedId = id;
                        else
                            this.userId = null;
                    }, err => this.errorAlert.open(err))
            },
            err => {
                if (err.status == 404)
                    this.confirmDialog.open('아이디 찾을 수 없음');
                else
                    this.errorAlert.open(err);
            })
    }

    getMatrix() {
        this.isProcessing = true;
        this.predictionService.getMfMatrix(this.requestData)
            .subscribe(data => {
                const numFeatures = data.numFeatures;
                this.userFileName = data.users;
                this.itemFileName = data.items;
                this.confirmDialog.open('매트릭스 계산됨');
                this.isProcessing = false;
            }, err => this.errorAlert.open(err));
    }

    resetUserId() {
        this.userId = null;
        this.selectedId = null;
    }

    calculate() {
        if (!this.userFileName || !this.itemFileName) {
            this.confirmDialog.open('매트릭스 계산을 먼저 해주세요.');
            return;
        }
        let items = [];
        this.predictionResults.forEach(elem => {
            const itemIndex = this.cateDict.indexOf(elem.categoryId);
            if (items.indexOf(itemIndex) < 0)
                items.push(itemIndex);
        });
        this.predictionService.getWalsScore(this.selectedId, items, this.userFileName, this.itemFileName)
            .subscribe(data =>
                this.predictionResults.forEach(elem => {
                    const itemIndex = this.cateDict.indexOf(elem.categoryId);
                    const index = items.indexOf(itemIndex);
                    elem.score = data[index];
                }), err => this.errorAlert.open(err));
    }
}

@Component({
    moduleId: module.id,
    templateUrl:'./id-confirm-dialog.html'
})
export class IdConfirmDialog {
    constructor(private dialogRef: MatDialogRef<IdConfirmDialog>) { }
}