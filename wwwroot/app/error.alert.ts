import { Component, Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    template: `
                <h3 mat-dialog-title>{{msg}}</h3>
                <mat-dialog-content>홈으로 이동합니다.</mat-dialog-content>
                <mat-dialog-actions>
                <button mat-button mat-dialog-close>확인</button>
                </mat-dialog-actions>
              `
})
export class ErrorDialog {
    constructor( @Inject(MAT_DIALOG_DATA) private data: string) { }
}

@Injectable()
export class ErrorAlert {
    constructor(private dialog: MatDialog,
        private router: Router) {
    }

    open(msg?: string) {
        this.dialog.open(ErrorDialog, {
            data: msg ? msg : '에러남!'
        }).afterClosed()
            .subscribe(() => this.router.navigate(['/']));
    }
}