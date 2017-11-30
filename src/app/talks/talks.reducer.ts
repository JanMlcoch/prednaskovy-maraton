import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import * as talkActions from './talks.actions';

export interface Talk {
  id: string;
  name: string;
}

// Entity adapter
export const talkAdapter = createEntityAdapter<Talk>();
export interface TalkState extends EntityState<Talk> { }

// const defaultTalk = {
//   ids: ['123'],
//   entities: {
//     '123': {
//       id: '123',
//       name: 'Testovací přednáška'
//     }
//   }
// };

const defaultTalk = {
  ids: [],
  entities: {}
};

export const initialState: TalkState = talkAdapter.getInitialState(defaultTalk);

export function talkReducer(
  state: TalkState = initialState,
  action: talkActions.TalksActions) {

  switch (action.type) {

    case talkActions.CREATE:
      return talkAdapter.addOne(action.talk, state);

    case talkActions.UPDATE:
      return talkAdapter.updateOne({
        id: action.id,
        changes: action.changes,
      }, state);

    case talkActions.DELETE:
      return talkAdapter.removeOne(action.id, state);

    default:
      return state;
  }
}

export const getTalkState = createFeatureSelector<TalkState>('talk');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = talkAdapter.getSelectors(getTalkState);
