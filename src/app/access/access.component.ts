import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../app.component';
import {FormStatus, GlobalActions, GlobalState, Status} from "../../reducers/global";
import {Observable} from "rxjs/Observable";

const {of, concat} = Observable;

@Component({
    selector: 'app-access',
    template: `
        <div class="access" [ngClass]="wrapperClasses|async">
            <a class="access__item" (click)="open($event, url)" *ngFor="let url of (urls|async)">
                <i class="material-icons mr-10" [ngClass]="urlIconClass|async">{{urlIcon|async}}</i> {{url}}
            </a>
        </div>
    `,
    styles: [`
        .access {
            position: relative;
            z-index: 1;
            height: 0;
            overflow: hidden;
            background: var(--inactive-grey);
            display: block;
            align-items: center;
            justify-content: space-between;
            padding-left: 44px; 
            padding-right: var(--double-spacing);
            font-family: monospace;
            font-size: 0.8rem;
        }
        .access__item {
            text-decoration: none;
            color: black;
            display: flex;
            align-items: center;
            height: 35px;
            cursor: pointer;
        }
        .access__item i {
            font-size: 16px;
        }
        .access__item:hover {
            color: var(--accent-blue)
        }
        .access--visible {
            height: calc(35px * 3);
            overflow: visible;
            transition: all .3s;
        }
        @media (min-width: 900px) {
            .access {
                display: flex;
            }
            .access--visible {
                height: 35px;
            }
        }
        .access--exit {
            height: 0;
            transition: all .3s;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessComponent implements OnInit {
    isActive: Observable<boolean>;
    wrapperClasses: Observable<string>;
    status: Observable<Status>;
    urls: Observable<string[]>;
    urlIcon: Observable<string>;
    urlIconClass: Observable<string>;
    constructor(private store: Store<AppState>) {
        this.status = store.select('global').map(x => x.status);
        this.urlIcon = this.status.map(status => {
            switch(status) {
                case Status.Pending:
                    return 'cached';
                default: return 'open_in_new';
            }
        });
        this.urlIconClass = this.status.map(status => {
            switch(status) {
                case Status.Pending:
                    return 'ani-spin';
                default: return '';
            }
        });

        this.urls = Observable.combineLatest(
            store.select('global').map(x => x.urls),
            this.status,
            (urls, status) => {
                if (status === Status.Pending) {
                    return ['...', '...', '...'];
                }
                if (urls.length === 0) {
                    return ['...', '...', '...'];
                }
                return urls;
            }
        );

        this.isActive = this.status.map(status => status === Status.Active);
        this.wrapperClasses = this.status.flatMap((status: Status) => {
            switch(status) {
                case Status.Active:
                case Status.Pending:
                    return of('access--visible');
                case Status.Idle: {
                    return concat(
                        of('access--exit'),
                        of('access--hidden').delay(400)
                    )
                }
            }
        });
    }

    open(evt, url) {
        evt.preventDefault();
        require('opn')(url);
    }

    ngOnInit(): void {
    }
}
