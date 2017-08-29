import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import {GlobalActions, Status} from "../reducers/global";

const {concat, of, defer, create, from, empty} = Observable;

import {remote} from 'electron';
const {setAppStatus} = remote.require('./main');

@Injectable()
export class AppStatusEffect {
    // Listen for the 'LOGIN' action
    @Effect() status$: Observable<Action> = this.actions$.ofType(GlobalActions.SetAppStatus)
    // Map the payload into JSON to use as the request body
        .mergeMap((action) => {

            const setup = create((obs) => {
                setAppStatus((action as any).payload, (err, res) => {
                    if (err) {
                        return obs.error(err);
                    }
                    obs.next(res);
                    obs.complete();
                })
            });

            return setup.ignoreElements();
        });

    constructor(
        private actions$: Actions
    ) {}
}

export function minimumTimeout(inputObservable: Observable<any>): Observable<any> {
    return Observable.zip(
        inputObservable,
        Observable.timer(500),
        (output) => output
    )
}
