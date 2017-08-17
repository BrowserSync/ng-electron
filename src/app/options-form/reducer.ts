import { Action } from '@ngrx/store';
import {BsProxyValues, MappingValues} from "./options-form.component";

export enum OptionsActions {
    UPDATE = 'UPDATE'
}

export interface OptionsState {
    port: number
    mappings: MappingValues[]
    proxies: BsProxyValues[]
}

export const defaultState: OptionsState = {
    port: 3000,
    mappings: [],
    proxies: []
};

export interface IAction<T> {
    type: string
    payload: T
}

export function optionsReducer(state = defaultState, action: Action) {
    switch(action.type) {
        case OptionsActions.UPDATE: {
            const {payload} = (action as IAction<OptionsState>);
            return {
                ...state,
                ...payload
            }
        }
        default: return state;
    }
}

export const actions = {
    [OptionsActions.UPDATE]: function(options: OptionsState) {
        return {
            type: OptionsActions.UPDATE,
            payload: options
        }
    }
}

export const optionAction = (name: OptionsActions, payload: any) => {
    return actions[OptionsActions.UPDATE](payload);
}