import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared/shared.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbAlertModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SignUpRoutingModule
  ],
  declarations: [SignUpComponent]
})
export class SignUpModule { }
