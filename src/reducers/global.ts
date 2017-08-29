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

export enum AppStatus {
    Pending = 'Pending',
    Ready = 'Ready'
}

export enum GlobalActions {
    SetStatus = 'SetStatus',
    SetFormStatus = 'SetFormStatus',
    SetBrowsersyncOptions = 'SetBrowsersyncOptions',
    ResetBrowsersyncOptions = 'ResetBrowsersyncOptions',
    BsInit = 'BsInit',
    SetAppStatus = 'SetAppStatus',
    BsStop = 'BsStop',
    ReceivePaths = 'ReceivePaths',
}

export interface GlobalState {
    port: number|null;
    status: Status;
    active: boolean;
    paths: [string, string][]
    urls: string[];
    formStatus: FormStatus;
    bsOptions: any;
    appStatus: AppStatus;
}

export const defaultState: GlobalState = {
    port: null,
    status: Status.Idle,
    active: false,
    urls: [],
    paths: [],
    formStatus: FormStatus.Valid,
    bsOptions: null,
    appStatus: AppStatus.Pending
};

export function globalReducer(state = defaultState, action: IAction<any>): GlobalState {
    switch (action.type) {
        case GlobalActions.SetStatus: {
            return {
                ...state,
                status: action.payload
            }
        }
        case GlobalActions.SetAppStatus: {
            return {
                ...state,
                appStatus: action.payload
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
                ...action.payload
            }
        }
        case GlobalActions.ResetBrowsersyncOptions: {
            return {
                ...state,
                urls: [],
                port: null
            }
        }
        case GlobalActions.ReceivePaths: {
            return {
                ...state,
                paths: action.payload,
            }
        }
        // case GlobalActions.SetBrowsersyncPort: {
        //     return {
        //         ...state,
        //         port: Number(action.payload)
        //     }
        // }
        default:
            return state;
    }
}
