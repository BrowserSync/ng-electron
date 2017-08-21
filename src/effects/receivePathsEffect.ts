import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import {GlobalActions, Status} from "../reducers/global";

const {concat, of, defer, create, from} = Observable;

import {remote} from 'electron';
import {setStatus} from "../reducers/global-actions";
const {initBs} = remote.require('./main');

@Injectable()
export class ReceivePathsEffect {
    // Listen for the 'LOGIN' action
    @Effect() dirs$: Observable<Action> = this.actions$.ofType(GlobalActions.ReceivePaths)
    // Map the payload into JSON to use as the request body
        .mergeMap((action) => {
            console.log(action);
            return Observable.empty();
        });

    constructor(
        private actions$: Actions
    ) {}
}