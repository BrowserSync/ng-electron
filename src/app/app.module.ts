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
import { IconComponent } from './icon/icon.component';
import { EffectsModule } from '@ngrx/effects';
// import { DirEffects } from '../effects/dir';

@NgModule({
  declarations: [
    AppComponent,
    OptionsFormComponent,
    IconComponent,
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
    }),
    // EffectsModule.forRoot([DirEffects ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
