import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as fromTalk from './talks.reducer';
import * as talkActions from './talks.actions';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.css']
})
export class TalksComponent implements OnInit {
  public talks: Observable<fromTalk.Talk[][]>;
  private itemsCollection: AngularFirestoreCollection<fromTalk.Talk[]>;

  constructor(private store: Store<fromTalk.TalkState>,
              private afs: AngularFirestore) {
    // db.collection('talks').valueChanges((event) => {
    //   console.log(event);
    // });
    this.itemsCollection = afs.collection<fromTalk.Talk[]>('items');
    this.talks = this.itemsCollection.valueChanges();
    this.talks.subscribe((item) =>  {
      console.log('talks item ', item);
    });
  }

  public ngOnInit() {
    // this.talks = this.store.select(fromTalk.selectAll);
    // this.talks.subscribe(data => {
    //   console.log('talks action', data);
    // });
  }

  public createTalk(name: string) {
    const talk: fromTalk.Talk = {
      id: new Date().getUTCMilliseconds().toString(),
      name,
    };

    this.store.dispatch(new talkActions.Create(talk));
  }

  public updateTalk(id, name) {
    this.store.dispatch(new talkActions.Update(id, {name: name}));
  }

  public deleteTalk(id) {
    this.store.dispatch(new talkActions.Delete(id));
  }
}
