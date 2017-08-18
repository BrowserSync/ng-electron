// counter.ts
import { Action } from '@ngrx/store';

export enum GlobalActions {
    SELECT_PATH = 'SELECT_PATH',
    SELECTED_PATHS = 'SELECTED_PATHS'
}

export interface GlobalState {
    active: boolean;
    urls: string[]
}

export const defaultState: GlobalState = {
    active: false,
    urls: []
};

export function globalReducer(state = defaultState, action: Action): GlobalState {
    switch (action.type) {
        default:
            return state;
    }
}