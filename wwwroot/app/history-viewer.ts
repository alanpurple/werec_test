import { Component,ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PredictionService } from './prediction.service';
import { ErrorAlert } from './error.alert';
import { UserHistoryData } from './user.history.data';

@Component({
    moduleId: module.id,
    templateUrl: './history-viewer.html'
})
export class HistoryViewer {
    constructor(
        private predictionService: PredictionService,
        private errorAlert: ErrorAlert
    ) {
        this.dataSource = new MatTableDataSource();
    }
    userId: number;
    limit: number = 30;
    slot: number = 20;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['id', 'title', 'slot', 'date', 'category'];
    isProcessing: boolean = false;

    dataSource: MatTableDataSource<UserHistoryData>;

    getHistory() {
        this.isProcessing = true;
        this.predictionService.getUserHistory(this.userId, this.slot, this.limit)
            .subscribe(data => {
                this.isProcessing = false;
                this.dataSource.data = data;
                this.dataSource.paginator = this.paginator
                this.dataSource.sort = this.sort;
            }, err => this.errorAlert.open(err))
    }
}