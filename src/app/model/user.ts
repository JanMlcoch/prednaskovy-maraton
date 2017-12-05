import {AngularFirestoreDocument} from 'angularfire2/firestore';

export class User {
  public uid: string = null;
  public email: string = null;
  public name: string = null;
  public displayName: string = null;
  public lunch: boolean = null;
  public willAttend: boolean = false;

  constructor(data: any,
              public ref: AngularFirestoreDocument<User>) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  public hasAllObligatoryFields(): boolean {
    return this.email && !!this.name;
  }

  public patch(): Promise<any> {
    const data = this.getUserData();
    console.log('patch user', data);
    return this.ref.update(data);
  }

  public getUserData() {
    return {
      email: this.email,
      name: this.name,
      lunch: this.lunch,
      willAttend: this.willAttend
    };
  }
}
