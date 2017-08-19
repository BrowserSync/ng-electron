import {Component, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {GlobalActions, GlobalState} from "../reducers/global";
import {Observable} from "rxjs/Observable";
import {optionAction, OptionsActions, OptionsState} from "./options-form/reducer";
import {ipcRenderer} from 'electron';

export interface AppState {
  global: GlobalState;
  options: OptionsState;
}

@Component({
  selector: 'app-root',
  template: `
    <app-options-form></app-options-form>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  global: Observable<GlobalState>;
  options: Observable<OptionsState>;
  constructor(private store: Store<AppState>) {

      this.global = store.select('global');
      this.options = store.select('options');

      ipcRenderer.send('win-ready');

      store.select('options')
          .map((x, i) => {
            // console.log(i);
            return x
          })
          .skip(4)
          .do(x => console.log('sending!', x))
          .do(options => ipcRenderer.send('options', options))
          .subscribe();
  }
}
