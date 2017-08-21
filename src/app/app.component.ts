import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {GlobalActions, GlobalState, Status} from "../reducers/global";
import {Observable} from "rxjs/Observable";
import {optionAction, OptionsActions, OptionsState} from "./options-form/reducer";
import {ipcRenderer} from 'electron';
import {initBs, receivePaths} from "../reducers/global-actions";

export interface AppState {
  global: GlobalState;
  options: OptionsState;
}

@Component({
  selector: 'app-root',
  template: `
    <app-status></app-status>
    <app-access></app-access>
    <main class="main">
        <app-options-form></app-options-form>
    </main>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  global: Observable<GlobalState>;
  options: Observable<OptionsState>;

  constructor(private store: Store<AppState>) {

      this.global = store.select('global');
      this.options = store.select('options');

      ipcRenderer.on('paths', function(evt, data) {
          store.dispatch(receivePaths(data))
      });

      store.select('options')
          .skip(1)
          .debounceTime(500)
          .withLatestFrom(this.global)
          .filter(([options, globalState]) => {
            return globalState.status === Status.Active
          })
          .map(([options, globalState]) => options)
          .do(x => console.log('sending!', x))
          .do(options => store.dispatch(initBs(options)))
          .subscribe();
  }
}
