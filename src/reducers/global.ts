// counter.ts
import { Action } from '@ngrx/store';

export enum GlobalActions {

}

export interface GlobalState {
    active: boolean;
    urls: string[];
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