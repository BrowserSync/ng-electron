import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import {GlobalActions, Status} from "../reducers/global";

const {concat, of, defer, create, from, empty} = Observable;

import {remote} from 'electron';
import {setStatus} from "../reducers/global-actions";
const {initBs, stopBs} = remote.require('./main');

@Injectable()
export class BsStopEffect {
    // Listen for the 'LOGIN' action
    @Effect() dirs$: Observable<Action> = this.actions$.ofType(GlobalActions.BsStop)
    // Map the payload into JSON to use as the request body
        .mergeMap((action) => {

            const setup = create((obs) => {
                stopBs(() => {
                    obs.next(true);
                    obs.complete();
                });
            });

            return concat(
                of(setStatus(Status.Pending)),
                setup
                    .flatMap(() => {
                        return concat(
                            of(setStatus(Status.Idle)),
                            of({type: GlobalActions.ResetBrowsersyncOptions})
                        )
                    })
                    .catch(err => {
                        console.log('ERROR', err);
                        return empty();
                    })
            );
        });

    constructor(
        private actions$: Actions
    ) {}
}
