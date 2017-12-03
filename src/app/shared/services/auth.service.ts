import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as fromTalk from '../../talks/talks.reducer';
import {User} from '../../model/user';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AuthService {
  public authState: any = null;
  public userData: Subject<User> = new Subject<User>();
  public userDataRef: AngularFirestoreDocument<any> = null;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {

    this.afAuth.authState.subscribe((auth) => {
      console.log('auth', auth);
      this.authState = auth;
      if (!this.authState) {
        console.log('user not logged');
        return;
      }
      this.userDataRef = this.afs.collection<any>('users').doc(this.authState.uid);
      this.userDataRef.valueChanges().take(1).subscribe((data) => {
        if (data) {
          this.userData.next(new User(data, this.userDataRef));
        } else {
          console.log('user data not created yet');
          const newUserData = {
            email: this.authState.email,
            displayName: this.authState.displayName
          };
          this.userDataRef.set(newUserData)
            .then((setEvent) => {
              console.log('new user created', data, setEvent);
            });
          this.userData.next(new User(newUserData, this.userDataRef));
        }
      });
    });
  }

  //// Social Auth ////
  public githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }

  public googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  public facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  public twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }

  public anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user;
      })
      .catch(error => console.log('error', error));
  }

  //// Anonymous Auth ////
  public emailSignUp(email: string, password: string, name: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        user.updateProfile({
          displayName: name,
        }).catch(
          (error) => {
            console.log('error', error);
          });
        // this.updateUserData();
      })
      .catch(error => console.log('error', error));
  }

  //// Email/Password Auth ////
  public emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        // this.updateUserData();
      })
      .catch(error => console.log('error', error));
  }

  // Sends email allowing user to reset password
  public resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log('error', error));
  }

  public signOut(): void {
    this.afAuth.auth.signOut();
    this.authState = null;
    this.userData.next(null);
    this.router.navigate(['/']);
  }


  //// Sign Out ////
  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        // this.updateUserData();
      })
      .catch(error => console.log('error', error));
  }

  // //// Helpers ////
  // private updateUserData(): void {
  //   // Writes user name and email to realtime db
  //   // useful if your app displays information about users or for admin features
  //
  //   const itemsCollection: AngularFirestoreCollection<User> = this.afs.collection<User>('users');
  //   // const users = itemsCollection.valueChanges();
  //
  //   const user: AngularFirestoreDocument<User> = itemsCollection.doc(this.currentUserId);
  //
  //   user.valueChanges().take(1)
  //     .subscribe((udata) => {
  //       console.log('user data', udata);
  //     });
  //
  //   //
  //   // user.update(data)
  //   //   .then((event) => {
  //   //     console.log('user updated', data, event);
  //   //   })
  //   //   .catch((event) => {
  //   //     console.log('user not in database', data, event);
  //   //   });
  //   //
  //   // console.log('user', user);
  // }
}
