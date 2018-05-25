import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ErrorAlert } from './error.alert';

@Component({
    moduleId: module.id,
    templateUrl: './home.html',
    styleUrls: ['./home.css']
})
export class Home {
    constructor(
        private errorAlert: ErrorAlert
    ) { }
}