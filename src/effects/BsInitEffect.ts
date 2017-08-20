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
export class BsInitEffect {
    // Listen for the 'LOGIN' action
    @Effect() dirs$: Observable<Action> = this.actions$.ofType(GlobalActions.BsInit)
    // Map the payload into JSON to use as the request body
        .mergeMap((action) => {

            const setup = create((obs) => {
                initBs((action as any).payload, (err, res) => {
                    if (err) {
                        return obs.error(err);
                    }
                    obs.next(res);
                    obs.complete();
                })
            });

            return concat(
                of(setStatus(Status.Pending)),
                minimumTimeout(setup)
                    .flatMap((output) => {
                        return concat(
                            of(setStatus(Status.Active)),
                            of({type: GlobalActions.SetBrowsersyncOptions, payload: output}),
                        )
                    })
            );
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
