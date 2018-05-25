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
import { ErrorDialog, ErrorAlert } from './error.alert';
import { ConfirmDialog, ConfirmDialogTemplate } from './confirm.dialog';
import { DealInfoService } from './dealinfo.service';

@NgModule({
    imports: [
        BrowserModule, FormsModule, HttpClientModule,
        BrowserAnimationsModule, AIscMaterialModule,
        NgxChartsModule,
        FlexLayoutModule,
        AppRouting
    ],
    declarations: [
        App, Home, ErrorDialog, ConfirmDialogTemplate, PredictionResults
    ],
    providers: [
        ErrorAlert, ConfirmDialog, DealInfoService
    ],
    bootstrap: [App],
    entryComponents: [
        ErrorDialog, ConfirmDialogTemplate
    ]
})
export class AppModule { }