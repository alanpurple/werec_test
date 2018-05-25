import { Component, Injectable, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    template: `
                <h3 mat-dialog-title>{{data}}</h3>
                <mat-dialog-actions>
                <button mat-button mat-dialog-close>확인</button>
                </mat-dialog-actions>
              `
})
export class ConfirmDialogTemplate {
    constructor( @Inject(MAT_DIALOG_DATA) public data: string) { }
}

@Injectable()
export class ConfirmDialog {
    constructor(private dialog: MatDialog) { }

    open(message?: string) {
        this.dialog.open(ConfirmDialogTemplate, {
            data: message ? message : '확인 메시지입니다'
        });
    }
}