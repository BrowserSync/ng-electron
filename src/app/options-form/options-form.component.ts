import 'rxjs/Rx';
import {Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import * as uuid from 'uuid/v4';
import {Store} from "@ngrx/store";
import {AppState} from "../app.component";
import {OptionsActions, OptionsState, optionAction} from "./reducer";
import {Observable} from "rxjs/Observable";
import {FormStatus, GlobalActions} from "../../reducers/global";
import {selectDirectoryEffect} from "../../effects/selectDirectory";
import {ipcRenderer} from 'electron';
import {setFormStatus} from "../../reducers/global-actions";

@Component({
    selector: 'app-options-form',
    templateUrl: './options-form.component.html',
    styleUrls: ['./options-form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsFormComponent implements OnInit {
    optionsForm: FormGroup;
    draggerOptions = {handle: '.drag-move'};
    isValid = false;
    valid$: Observable<boolean>;
    paths: Observable<string[]>;
    @ViewChildren('proxies') proxyChildren: QueryList<ElementRef>;
    @ViewChildren('mappings') mappingChildren: QueryList<ElementRef>;
    // directorySelection: Observable<{id: string, paths: string[]}>;

    constructor(private fb: FormBuilder, public store: Store<AppState>) {
        this.paths = store.select('global', 'paths').map((paths) => paths.map(([path, mime]) => path));
    }

    get mappings(): FormArray {
        return <FormArray>this.optionsForm.get('mappings');
    }

    get proxies(): FormArray {
        return <FormArray>this.optionsForm.get('proxies');
    }

    inputFocused(incoming) {
        console.log(incoming.value);
    }

    addMapping() {
        const id = uuid();
        this.mappings.push(this.createMapping(id, this.mappings.controls.length));
        this.mappingChildren.changes.take(1).subscribe(children => {
            children.last.nativeElement.focus();
        });
    }

    addProxy() {
        const id = uuid();
        this.proxies.push(this.createProxy(id, this.mappings.controls.length));
        this.proxyChildren.changes.take(1).subscribe(children => {
            children.last.nativeElement.focus();
        });
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
                this.store.dispatch(setFormStatus(FormStatus.Valid));
                this.store.dispatch(optionAction(OptionsActions.UPDATE, options))
            });

        // The 'invalid' stream could be used to disable buttons etc
        invalid
            .subscribe(() => {
                this.store.dispatch(setFormStatus(FormStatus.Invalid));
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
