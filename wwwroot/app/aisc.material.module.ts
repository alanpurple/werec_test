import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatCheckboxModule,
    MatChipsModule, MatDialogModule, MatGridListModule,
    MatIconModule, MatInputModule, MatRadioModule,
    MatSidenavModule, MatListModule, MatToolbarModule,
    MatMenuModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, MatExpansionModule, MatTableModule,
    MatSlideToggleModule, MatSliderModule, MatProgressSpinnerModule,
    MatTooltipModule, MatProgressBarModule, MatTreeModule,
    MatPaginatorModule, MatPaginator, MatSortModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
    imports: [
        MatButtonModule, MatCardModule, MatCheckboxModule,
        MatChipsModule, MatDialogModule, MatGridListModule,
        MatIconModule, MatInputModule, MatRadioModule,
        MatSidenavModule, MatListModule, MatToolbarModule,
        MatMenuModule, MatSelectModule, MatDatepickerModule,
        MatNativeDateModule, MatExpansionModule, MatTableModule,
        CdkTableModule, MatSlideToggleModule, MatSliderModule,
        MatProgressSpinnerModule, MatTooltipModule, MatProgressBarModule,
        MatTreeModule, MatPaginatorModule, MatSortModule
    ],
    exports: [
        MatButtonModule, MatCardModule, MatCheckboxModule,
        MatChipsModule, MatDialogModule, MatGridListModule,
        MatIconModule, MatInputModule, MatRadioModule,
        MatSidenavModule, MatListModule, MatToolbarModule,
        MatMenuModule, MatSelectModule, MatDatepickerModule,
        MatNativeDateModule, MatExpansionModule, MatTableModule,
        CdkTableModule, MatSlideToggleModule, MatSliderModule,
        MatProgressSpinnerModule, MatTooltipModule, MatProgressBarModule,
        MatTreeModule, MatPaginatorModule, MatSortModule
    ]
})
export class AIscMaterialModule { }