import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.component';
import {FormStatus, GlobalActions, GlobalState, Status} from "../../reducers/global";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-status',
    template: `
        <div class="status">
            <span class="f-mono">STATUS: {{(global | async).status}}</span>
            <div class="ml">
                <button type="button" class="btn btn-icon c-white" (click)="setStatus()">
                    <i class="material-icons">{{icon | async}}</i>
                </button>
            </div>
        </div>
    `,
    styles: [`
        :host .status {
            display: flex;
            font-size: .8rem;
            align-items: center;
        }

        .status .icon-button {
            color: red;
        }

        .btn {
            background: none;
            border: 0;
            cursor: pointer;
            padding: 0;
            height: 24px;
            line-height: 24px;
        }

        .btn:hover {
            transition: all .2s;
            transform: scale(1.1);
        }

        .c-white {
            color: white;
        }

        .ml {
            margin-left: var(--base-spacing);
        }
    `]
})
export class StatusComponent implements OnInit {
    global: Observable<GlobalState>;
    icon: Observable<string>;
    status: Observable<Status>;
    formStatus: Observable<FormStatus>;

    constructor(private store: Store<AppState>) {
        this.global = store.select('global');
        this.status = store.select('global').map(x => x.status);
        this.formStatus = store.select('global').map(x => x.formStatus);
        this.icon = this.status.map((status: Status) => {
            switch (status) {
                case Status.Idle:
                    return 'play_circle_filled';
                case Status.Active:
                    return 'pause';
                case Status.Pending:
                    return 'access_time';
                case Status.Errored:
                    return 'error';
            }
        })
    }

    setStatus() {
        this.status.take(1)
            .map(status => {
                switch (status) {
                    case Status.Idle: {
                        return GlobalActions.BsInit
                    }
                    default: return GlobalActions.BsStop
                }
            })
            .withLatestFrom(this.store.select('options'), this.formStatus)
            .filter(([actionName, options, formStatus]) => formStatus === FormStatus.Valid)
            .do(([actionName, options]) => {
                this.store.dispatch({type: actionName, payload: options});
            })
            .subscribe();
    }

    ngOnInit() {
    }
}
