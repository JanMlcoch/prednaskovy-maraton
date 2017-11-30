import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as fromTalk from '../../talks/talks.reducer';

@Injectable()
export class AuthService {

  public authState: any = null;
  public userRef: AngularFireObject<any>;

  constructor(private afAuth: AngularFireAuth,
              // private db: AngularFireDatabase,
              private afs: AngularFirestore,
              private router: Router) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState['displayName'] || this.authState['email'];
    }
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
      .catch(error => console.log(error));
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
            console.log(error);
          });
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  public emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  // Sends email allowing user to reset password
  public resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  public signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }


  //// Sign Out ////
  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData();
      })
      .catch(error => console.log(error));
  }

  //// Helpers ////
  private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features

    const itemsCollection: AngularFirestoreCollection<User> = this.afs.collection<User>('users');
    const users = itemsCollection.valueChanges();

    // const user: AngularFirestoreDocument<User> = itemsCollection.doc('blababl');
    const user: AngularFirestoreDocument<User> = itemsCollection.doc(this.currentUserId);
    const data = {
      email: this.authState.email,
      name: this.authState.displayName
    };

    user.update(data)
    .then((event) => {
      console.log('user updated', data, event);
    })
    .catch((event) => {
      console.log('user not in database', data, event);
      user.set(data).then((setEvent) => {
        console.log('new user created - some profile route?', data, setEvent);
      });
    });

    console.log('user', user);

    this.afs.collection('users', ref => ref.where('size', '==', 'large'));

    users.subscribe((item) => {
      console.log(item);
    });

    // const path = `users/${this.currentUserId}`; // Endpoint on firebase
    // const userRef: AngularFireObject<any> = this.db.object(path);
    //

    //
    // userRef.update(data)
    //   .catch(error => console.log(error));
  }

  private updateUser(userData) {
    this.authState.updateProfile(userData);
  }
}

interface User {
  email: string;
  name: string;
}
