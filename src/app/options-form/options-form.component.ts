import 'rxjs/Rx';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import * as uuid from 'uuid/v4';
import {Store} from "@ngrx/store";
import {AppState} from "../app.component";
import {OptionsActions, OptionsState, optionAction} from "./reducer";
import {Observable} from "rxjs/Observable";
import {GlobalActions} from "../../reducers/global";

@Component({
    selector: 'app-options-form',
    templateUrl: './options-form.component.html',
    styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit {
    optionsForm: FormGroup;
    draggerOptions = {handle: '.drag-move'};
    isValid = false;
    valid$: Observable<boolean>

    constructor(private fb: FormBuilder, public store: Store<AppState>) {}

    get mappings(): FormArray {
        return <FormArray>this.optionsForm.get('mappings');
    }

    get proxies(): FormArray {
        return <FormArray>this.optionsForm.get('proxies');
    }

    addMapping() {
        const id = uuid();
        this.mappings.push(this.createMapping(id, this.mappings.controls.length))
    }

    addProxy() {
        const id = uuid();
        this.proxies.push(this.createProxy(id, this.mappings.controls.length))
    }

    deleteMapping(incoming: FormGroup, i) {
        this.mappings.removeAt(i);
    }

    addFolder(incoming: FormGroup, i) {
        // incoming.patchValue({dir: '/Users/shakyshane'});
        this.store.dispatch({
            type: GlobalActions.SELECT_PATH,
            // payload: incoming.get('id').value
            payload: i
        });
    }

    deleteProxy(incoming: FormGroup, i) {
        this.proxies.removeAt(i);
    }

    pauseProxy(incoming: FormGroup, i) {
        incoming.patchValue({active: !incoming.get('active').value});
    }

    pauseMapping(incoming: FormGroup, i) {
        incoming.patchValue({active: !incoming.get('active').value});
    }

    createProxy(id, sortOrder): FormGroup {
        const proxy: BsProxyCreate = {
            target: ['', [Validators.required, (item) => {
                try {
                    const url = new URL(item.value);
                } catch (e) {
                    return {
                        invalidFormat: true
                    }
                }
                return null;
            }]],
            id,
            sortOrder,
            active: true
        }
        return this.fb.group(proxy);
    }

    prefillMapping(incoming: FormGroup, i = 0) {
        // incoming.patchValue({dir: 'shane'});
        // console.log(this.mappings.controls.reverse());
    }

    createMapping(id: string, sortOrder: number): FormGroup {
        const mapping: MappingCreate = {
            dir: ['', Validators.required],
            route: ['', Validators.required],
            id,
            sortOrder,
            active: true
        };
        return this.fb.group(mapping);
    }

    ngOnInit() {
        this.optionsForm = this.fb.group({
            port: [{value: 3000, disabled: false}, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(5),
                Validators.pattern('\\d+')
            ]],
            mappings: this.fb.array([]),
            proxies: this.fb.array([]),
        });

        const form = this.optionsForm;

        // partition returns 2 observables, one contains elements that pass the test
        // the other contains elements that fail
        const [valid, invalid] = form.statusChanges.partition(x => x === 'VALID');

        this.valid$ = form.statusChanges
            .map(x => x === 'VALID')
            .startWith(true);

        // Now we can listen to the 'valid' stream and when it emits events,
        // we grab the latest values from the 'valueChanges' stream
        // This means we can have logic that only fires when valid
        // + we get access to the values that caused it to be valid
        valid
            .withLatestFrom(form.valueChanges)
            .subscribe(([_, values]) => {
                const options: OptionsState = values;
                this.store.dispatch(optionAction(OptionsActions.UPDATE, options))
            });

        // The 'invalid' stream could be used to disable buttons etc
        invalid
            .subscribe(invalid =>
                console.log('INVALID!', invalid)
            );
    }
}

export interface MappingValues {
    dir: string
    route: string
    id: string
    sortOrder: number
    active: boolean
}

export interface MappingCreate {
    dir: any[]
    route: any[]
    id: string
    sortOrder: number
    active: boolean
}


export interface BsProxyValues {
    target: string
    id: string
    sortOrder: number
    active: boolean
}

export interface BsProxyCreate {
    target: any[]
    id: string
    sortOrder: number
    active: boolean
}
