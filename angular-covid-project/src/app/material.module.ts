import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatListModule,
  MatDividerModule,
  MatSidenavModule,
  MatExpansionModule,
  MatDialogModule,
  MatRadioModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatTabsModule
} from '@angular/material';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatTabsModule,
    ChartsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    ChartsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class MaterialModule { }
