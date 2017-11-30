import { Action } from '@ngrx/store';
import { Talk } from './talks.reducer';

export const CREATE = '[Talks] Create';
export const UPDATE = '[Talks] Update';
export const DELETE = '[Talks] Delete';

export class Create implements Action {
  public readonly type = CREATE;
  constructor(public talk: Talk) {

    console.log('talk created');

  }
}

export class Update implements Action {
  public readonly type = UPDATE;
  constructor(
    public id: string,
    public changes: Partial<Talk>,
  ) {
    console.log('talk changed');

  }
}

export class Delete implements Action {
  public readonly type = DELETE;
  constructor(public id: string) {
    console.log('talk deleted');

  }
}

export type TalksActions
  = Create
  | Update
  | Delete;
