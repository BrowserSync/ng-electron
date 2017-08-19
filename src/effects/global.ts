// ./effects/auth.ts
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import {GlobalActions, Status} from "../reducers/global";

const {concat, of, defer, create, from} = Observable;

import {remote} from 'electron';
const {initBs} = remote.require('./main');

// const {init, Methods} = require('bs-lite');
// const {bs, system} = init();

@Injectable()
export class GlobalEffects {
    // Listen for the 'LOGIN' action
    @Effect() dirs$: Observable<Action> = this.actions$.ofType(GlobalActions.BsInit)
    // Map the payload into JSON to use as the request body
        .mergeMap((action) => {
            return concat(
                of({type: GlobalActions.SetStatus, payload: Status.Pending}),
                create((obs) => {
                    initBs((action as any).payload, (err, res) => {
                        if (err) {
                            return obs.error(err);
                        }
                        obs.next(res);
                        obs.complete();
                    })
                }).flatMap((port) => {
                    return concat(
                        of({type: GlobalActions.SetStatus, payload: Status.Active}),
                        // of({type: GlobalActions.SetBrowsersyncOptions, payload: options}),
                        of({type: GlobalActions.SetBrowsersyncPort, payload: port})
                    )
                })
            );
        });

    constructor(
        private actions$: Actions
    ) {}
}
