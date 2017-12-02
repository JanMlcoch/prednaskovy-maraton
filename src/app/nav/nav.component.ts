import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import { MatDialog } from '@angular/material';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {User} from 'firebase';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public isLoggedIn$ = this.authService.currentUserObservable;
  public window = window;

  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private dialog: MatDialog) {
  }

  public ngOnInit() {
    this.isLoggedIn$.subscribe(data => {
      console.log('logged', data);
      this.afs.collection<User>('users').doc(data.uid).valueChanges()
        .subscribe((udata) => {
        console.log('user data', udata);
      });
    });
  }

  get displayName() {
    return this.authService.currentUserDisplayName;
  }

  public logOut() {
    this.authService.signOut();
  }

  public openSignInDialog(): void {
    this.dialog.open(SignInComponent, {
      disableClose: false,
    });
  }
}
