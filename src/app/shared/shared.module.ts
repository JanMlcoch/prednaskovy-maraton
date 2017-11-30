import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatSelectModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  exports: [
    NgbAlertModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  declarations: [
  ],
})
export class SharedComponentsModule {
}
