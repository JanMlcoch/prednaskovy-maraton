import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth.module';
import { UserModule } from './user.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    AuthModule,
    UserModule,
  ],
})
export class ServicesModule {
}
