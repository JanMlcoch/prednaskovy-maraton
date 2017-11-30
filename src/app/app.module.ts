import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/store.config';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NavComponent } from './nav/nav.component';
import { ServicesModule } from './shared/services/services.module';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { MatFormFieldModule } from '@angular/material';
import { SignInComponent } from './sign-in/sign-in.component';
import { SharedComponentsModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularFirestore, AngularFirestoreModule} from 'angularfire2/firestore';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    ContentComponent,
    SignInComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SharedComponentsModule,
    BrowserModule,
    MatFormFieldModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    ServicesModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SignInComponent],
})
export class AppModule { }
