// counter.ts
import { Action } from '@ngrx/store';

export enum GlobalActions {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT',
    RESET = 'RESET',
}

export interface GlobalState {
    active: boolean;
}

export const defaultState: GlobalState = {
    active: false
};

export function globalReducer(state = defaultState, action: Action): GlobalState {
    switch (action.type) {
        case GlobalActions.INCREMENT:
            return {
                active: !state.active
            }
        default:
            return state;
    }
}