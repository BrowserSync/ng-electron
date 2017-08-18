// ./effects/auth.ts
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import {GlobalActions} from "../reducers/global";

import {remote} from 'electron';
const {selectDirectory} = remote.require('./main');

@Injectable()
export class DirEffects {
    // Listen for the 'LOGIN' action
    @Effect() dirs$: Observable<Action> = this.actions$.ofType(GlobalActions.SELECT_PATH)
    // Map the payload into JSON to use as the request body
        .mergeMap(payload => {
            return Observable.create(obs => {
                selectDirectory((res) => {
                    obs.next(res);
                });
            }).map(paths => {
                return {
                    type: GlobalActions.SELECTED_PATHS,
                    payload: {
                        paths,
                        id: payload
                    }
                }
            })
        });

    constructor(
        private actions$: Actions
    ) {}
}