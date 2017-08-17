import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import { OptionsFormComponent } from './options-form/options-form.component';
import { StoreModule } from '@ngrx/store';
import { globalReducer } from '../reducers/global';
import {  SortablejsModule } from 'angular-sortablejs';
import {optionsReducer} from "./options-form/reducer";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    OptionsFormComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    SortablejsModule,
    StoreModule.forRoot({
        global: globalReducer,
        options: optionsReducer
    }),
    StoreDevtoolsModule.instrument({
        maxAge: 25 //  Retains last 25 states
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
