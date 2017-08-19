import 'rxjs/Rx';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import * as uuid from 'uuid/v4';
import {Store} from "@ngrx/store";
import {AppState} from "../app.component";
import {OptionsActions, OptionsState, optionAction} from "./reducer";
import {Observable} from "rxjs/Observable";
import {FormStatus, GlobalActions} from "../../reducers/global";
import {selectDirectoryEffect} from "../../effects/selectDirectory";
import {ipcRenderer} from 'electron';

@Component({
    selector: 'app-options-form',
    templateUrl: './options-form.component.html',
    styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit {
    optionsForm: FormGroup;
    draggerOptions = {handle: '.drag-move'};
    isValid = false;
    valid$: Observable<boolean>;
    // directorySelection: Observable<{id: string, paths: string[]}>;

    constructor(private fb: FormBuilder, public store: Store<AppState>) {
        // ipcRenderer.on('receive-options', (event, options) => {
        //     const port = Number(options.port);
        //     this.optionsForm.get('port').patchValue(port);
        //     const gs = options.proxies.map((x: BsProxyValues) => {
        //         return this.createProxy(x.id, x.sortOrder, x.target, x.active);
        //     }).forEach(x => {
        //         this.proxies.push(x);
        //     });
        //     const ms = options.mappings.map((x: MappingValues) => {
        //         return this.createMapping(x.id, x.sortOrder, x.dir, x.route, x.active);
        //     }).forEach(x => {
        //         this.mappings.push(x);
        //     });
        // });
    }

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
        selectDirectoryEffect().then(paths => {
            if (paths && paths.length) {
                incoming.patchValue({dir: paths[0]})
            }
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

    createProxy(id, sortOrder, target = '', active = true): FormGroup {
        const proxy: BsProxyCreate = {
            target: [target, [Validators.required, (item) => {
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
            active,
        }
        return this.fb.group(proxy);
    }

    prefillMapping(incoming: FormGroup, i = 0) {
        // incoming.patchValue({dir: 'shane'});
        // console.log(this.mappings.controls.reverse());
    }

    createMapping(id: string, sortOrder: number, dir = '', route = '', active = true): FormGroup {
        const mapping: MappingCreate = {
            dir: [dir, Validators.required],
            route: [route, Validators.required],
            id,
            sortOrder,
            active
        };
        return this.fb.group(mapping);
    }

    ngOnInit() {
        this.optionsForm = this.fb.group({
            port: [{value: 3000, disabled: false}, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(5),
                Validators.pattern('\\d+'),
                (item) => {
                    if (item.value > 1023 && item.value < 10000) {
                        return null;
                    }
                    return {
                        outOfRange: true
                    };
                }
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
                this.store.dispatch({type: GlobalActions.SetFormStatus, payload: FormStatus.Valid});
                this.store.dispatch(optionAction(OptionsActions.UPDATE, options))
            });

        // The 'invalid' stream could be used to disable buttons etc
        invalid
            .subscribe(invalid => {
                this.store.dispatch({type: GlobalActions.SetFormStatus, payload: FormStatus.Invalid});
            });
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
