import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as fromTalk from './talks.reducer';
import * as talkActions from './talks.actions';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {User} from '../model/user';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.css']
})
export class TalksComponent implements OnInit {
  public talks: Observable<fromTalk.Talk[][]>;
  private itemsCollection: AngularFirestoreCollection<fromTalk.Talk[]>;
  public user: User = null;

  constructor(private store: Store<fromTalk.TalkState>,
              private afs: AngularFirestore,
              private auth: AuthService
              ) {
    // db.collection('talks').valueChanges((event) => {
    //   console.log(event);
    // });
    this.itemsCollection = afs.collection<fromTalk.Talk[]>('talks');
    this.talks = this.itemsCollection.valueChanges();
    this.talks.subscribe((item) =>  {
      console.log('talks item ', item);
    });
  }

  public ngOnInit() {
    this.auth.userData.subscribe((userData: User) => {
      if (userData === null) {
        return;
      }
      console.log('talks got user data', userData);
      this.user = userData;
    });
  }

  public createTalk(name: string) {
    const talk: Talk = {
      userUid: this.user.ref.ref.id,
      created: new Date().getUTCMilliseconds().toString(),
      name,
    };

    const newTalk: AngularFirestoreDocument<Talk> = this.itemsCollection.doc(this.afs.createId());
    newTalk.set(talk).then((data) => {
      console.log('talk added', data);
    });

    // this.store.dispatch(new talkActions.Create(talk));
  }

  public updateTalk(id, name) {
    this.store.dispatch(new talkActions.Update(id, {name: name}));
  }

  public deleteTalk(id) {
    this.store.dispatch(new talkActions.Delete(id));
  }
}

export interface Talk {
  created: string;
  name: string;
  userUid: string;
}
