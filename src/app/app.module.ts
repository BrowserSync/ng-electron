import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import { OptionsFormComponent } from './options-form/options-form.component';
import { StoreModule } from '@ngrx/store';
import { globalReducer } from '../reducers/global';

@NgModule({
  declarations: [
    AppComponent,
    OptionsFormComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ global: globalReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
