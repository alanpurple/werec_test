import { Component,OnInit } from '@angular/core';

import { DealInfoService } from './dealinfo.service';
import { PredictionData } from './prediction.data';
import { ErrorAlert } from './error.alert';

@Component({
    moduleId: module.id,
    styleUrls: [],
    templateUrl: './prediction.results.html'
})
export class PredictionResults implements OnInit {
    constructor(private dealInfoService: DealInfoService,
        private errorAlert: ErrorAlert) { }
    data: PredictionData[] = [];

    ngOnInit() {
    }

    newData = null;

    addResult() {
        if (this.newData.dealId == 0) {
            console.log('dealId not entered');
            return;
        }
        this.dealInfoService.getSingleResult(this.newData.dealId)
            .subscribe(res => this.data.push(res),
                err => this.errorAlert.open(err));
        this.newData = null;
    }

    initNewData() {
        this.newData = {
            dealId: 0,
            score: 0
        };
    }

    removeResult(index: number) {
        this.data.splice(index, 1);
    }
}

//const sampleData = [{
//    dealId: 3519047, score: 0.7
//}, {
//    dealId: 3483431, score: 0.5
//}, {
//    dealId: 3529615, score: 0.6
//}];