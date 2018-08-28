import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AIscMaterialModule } from './aisc.material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';

import { App } from './app';
import { AppRouting } from './app.routing';

import { Home } from './home';
import { PredictionResults } from './prediction.results';
import { PredictionTable } from './prediction.table';
import { HistoryViewer } from './history-viewer';
import { ErrorDialog, ErrorAlert } from './error.alert';
import { ConfirmDialog, ConfirmDialogTemplate } from './confirm.dialog';
import { DealInfoService } from './dealinfo.service';
import { PredictionService } from './prediction.service';
import { IdConfirmDialog, WalsSimulator } from './wals-simulator';

@NgModule({
    imports: [
        BrowserModule, FormsModule, HttpClientModule,
        BrowserAnimationsModule, AIscMaterialModule,
        NgxChartsModule,
        FlexLayoutModule,
        AppRouting
    ],
    declarations: [
        App, Home, ErrorDialog, ConfirmDialogTemplate, PredictionResults,
        PredictionTable, HistoryViewer, WalsSimulator, IdConfirmDialog
    ],
    providers: [
        ErrorAlert, ConfirmDialog, DealInfoService, PredictionService
    ],
    bootstrap: [App],
    entryComponents: [
        ErrorDialog, ConfirmDialogTemplate, IdConfirmDialog
    ]
})
export class AppModule { }