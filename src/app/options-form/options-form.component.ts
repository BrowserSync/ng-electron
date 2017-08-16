import 'rxjs/Rx';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import * as uuid from 'uuid/v4';
import {BsProxy, Mapping} from "./interfaces";

@Component({
    selector: 'app-options-form',
    template: `
        <form [formGroup]="optionsForm" novalidate>
            <div class="field">
                <input
                    formControlName="port"
                    type="text"
                    placeholder="eg: 3200"
                />
            </div>
            <div class="field">
                <p><strong>Proxies</strong> <button type="button" (click)="addProxy()">Add</button></p>
                <div [sortablejs]="proxies" [sortablejsOptions]="draggerOptions">
                    <div class="field-item" formArrayName="proxies" *ngFor="let proxy of proxies.controls; let i=index">
                        <div class="mapping" [formGroupName]="i">
                            <input formControlName="target" id="{{'proxy' + i}}">
                            <button type="button" (click)="deleteProxy(proxy, i)">Delete</button>
                            <button type="button" class="drag-move">move</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field">
                <p><strong>Mappings</strong> <button type="button" (click)="addMapping()">Add</button></p>
                <div [sortablejs]="mappings" [sortablejsOptions]="draggerOptions">
                    <div class="field-item" formArrayName="mappings" *ngFor="let mapping of mappings.controls; let i=index">
                        <div class="mapping" [formGroupName]="i">
                            <input formControlName="dir" id="{{'dir' + i}}">
                            <input formControlName="route" id="{{'route' + i}}">
                            <button type="button" (click)="deleteMapping(mapping, i)">Delete</button>
                            <button type="button" class="drag-move">move</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `,
    styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit {
    optionsForm: FormGroup;
    draggerOptions = {handle: '.drag-move'};

    constructor(private fb: FormBuilder) {}

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

    deleteProxy(incoming: FormGroup, i) {
        this.proxies.removeAt(i);
    }

    createProxy(id, sortOrder): FormGroup {
        const proxy: BsProxy = {
            target: '',
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
        const mapping: Mapping = {
            dir: '',
            route: '',
            id,
            sortOrder,
            active: true
        }
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

        this.optionsForm.valueChanges
            .pluck('proxies')
            .distinctUntilChanged((a: FormArray, b: FormArray) => a.length === b.length)
            .subscribe((x: any[]) => {
                console.table(x);
                // console.log('Mapping length:', x.length);
            })
    }
}
