import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.component';
import {FormStatus, GlobalActions, GlobalState, Status} from "../../reducers/global";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'app-status',
    template: `
        <header class="status" [ngClass]="statusClass|async">
            <div class="mr">
                <button type="button" 
                        class="btn btn-icon c-white"
                        [disabled]="isDisabled|async"
                        [ngClass]="{'ani-spin': (global | async).status === 'Pending'}"
                        (click)="setStatus()">
                    <i class="material-icons">{{icon | async}}</i>
                </button>
            </div>
            <span class="f-mono">STATUS: {{(global | async).status}}</span>
        </header>
    `,
    styles: [`
        :host .status {
            position: relative;
            z-index: 2;
            display: flex;
            font-size: .8rem;
            align-items: center;
            padding: var(--half-spacing) var(--double-spacing);
            background-colour: var(--accent-blue);
            color: white;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent implements OnInit {
    global: Observable<GlobalState>;
    icon: Observable<string>;
    status: Observable<Status>;
    formStatus: Observable<FormStatus>;
    statusClass: Observable<string>;
    isPending: Observable<boolean>;
    isDisabled: Observable<boolean>;

    constructor(private store: Store<AppState>) {
        this.global = store.select('global');
        this.status = store.select('global').map(x => x.status);
        const formStatus = store.select('global').map(x => x.formStatus);
        this.isPending = store.select('global').map(x => x.status === Status.Pending);
        this.isDisabled = this.isPending.combineLatest(formStatus)
            .map(([pending, formStatus]) => {
                if (pending) return true;
                if (formStatus === FormStatus.Invalid) {
                    return true
                }
                return false;
            });
        this.formStatus = store.select('global').map(x => x.formStatus);
        this.statusClass = this.status.map((status: Status) => {
            switch (status) {
                case Status.Pending:
                case Status.Idle:
                    return 'bg-blue';
                case Status.Active:
                    return 'bg-green';
                case Status.Errored:
                    return 'bg-red';
            }
        });
        this.icon = this.status.map((status: Status) => {
            switch (status) {
                case Status.Idle:
                    return 'play_circle_filled';
                case Status.Active:
                    return 'stop';
                case Status.Pending:
                    return 'cached';
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
