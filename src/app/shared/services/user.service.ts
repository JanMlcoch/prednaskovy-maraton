import { Injectable, NgModule } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import {User} from './user_interface';

@Injectable()
export class UserService {
  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
      this._user = snapshot.val();
    }.bind(this));
  }

  _user: User;

  get user(): User {
    return this._user;
  }

  updateUser(userData) {
    // const updates = {};
    // updates['/users/' + this.authService.currentUserId] = userData;
    // firebase.database().ref().update(updates);
  }

}

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [UserService],
})
export class UserModule {
}
