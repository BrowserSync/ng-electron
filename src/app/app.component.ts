import {Component, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {GlobalActions, GlobalState} from "../reducers/global";
import {Observable} from "rxjs/Observable";
import {OptionsState} from "./options-form/reducer";

export interface AppState {
  global: GlobalState;
  options: OptionsState;
}

@Component({
  selector: 'app-root',
  template: `
    <app-options-form></app-options-form>
    <pre><code>{{options|async|json}}</code></pre>  
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  global: Observable<GlobalState>;
  options: Observable<OptionsState>;
  constructor(private store: Store<AppState>) {
      this.global = store.select('global');
      this.options = store.select('options');
  }
}
