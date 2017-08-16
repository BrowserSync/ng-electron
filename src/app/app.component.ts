import {Component, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {GlobalActions, GlobalState} from "../reducers/global";
import {Observable} from "rxjs/Observable";

export interface AppState {
  global: GlobalState;
}

@Component({
  selector: 'app-root',
  template: `
    <app-options-form></app-options-form>
    <button type="button" (click)="click()">Click</button>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  global: Observable<GlobalState>
  active: Observable<boolean>
  constructor(private store: Store<AppState>) {
      this.global = store.select('global');
  }

  click() {
    this.store.dispatch({
        type: GlobalActions.INCREMENT,
        payload: true
    });
  }
}
