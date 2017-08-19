// counter.ts
import { Action } from '@ngrx/store';
import {IAction} from "../app/options-form/reducer";

export enum Status {
    Idle = 'Idle',
    Active = 'Active',
    Pending = 'Pending',
    Errored = 'Errored',
}

export enum FormStatus {
    Valid = 'Valid',
    Invalid = 'Invalid',
}

export enum GlobalActions {
    SetStatus = 'SetStatus',
    SetFormStatus = 'SetFormStatus',
    SetBrowsersyncOptions = 'SetBrowsersyncOptions',
    SetBrowsersyncPort = 'SetBrowsersyncPort',
    BsInit = 'BsInit',
    BsStop = 'BsStop',
}

export interface GlobalState {
    port: number|null;
    status: Status;
    active: boolean;
    urls: string[];
    formStatus: FormStatus
    bsOptions: any
}

export const defaultState: GlobalState = {
    port: null,
    status: Status.Idle,
    active: false,
    urls: [],
    formStatus: FormStatus.Valid,
    bsOptions: null
};

export function globalReducer(state = defaultState, action: IAction<any>): GlobalState {
    switch (action.type) {
        case GlobalActions.SetStatus: {
            return {
                ...state,
                status: action.payload
            }
        }
        case GlobalActions.SetFormStatus: {
            return {
                ...state,
                formStatus: action.payload
            }
        }
        case GlobalActions.SetBrowsersyncOptions: {
            return {
                ...state,
                bsOptions: action.payload
            }
        }
        case GlobalActions.SetBrowsersyncPort: {
            return {
                ...state,
                port: Number(action.payload)
            }
        }
        default:
            return state;
    }
}
