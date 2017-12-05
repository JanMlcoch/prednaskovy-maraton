import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {SignInComponent} from '../sign-in/sign-in.component';
import {MatDialog} from '@angular/material';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {User} from '../model/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public window = window;
  public user: User = null;

  constructor(public authService: AuthService,
              private afs: AngularFirestore,
              private dialog: MatDialog,
              private router: Router) {
  }

  public ngOnInit() {
    this.authService.userData.subscribe(user => {
      this.user = user;
      if (user && (!user.hasAllObligatoryFields() || !user.willAttend)) {
        console.log('user has not all obligatory fields, navigate to profile');
        this.router.navigate(['/profile']);
      }
    });
  }

  get displayName() {
    return this.user ? this.user.name : '';
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
