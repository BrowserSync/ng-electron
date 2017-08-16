import 'rxjs/Rx';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';

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
                <p><strong>Mappings</strong> <button type="button" (click)="addMapping()">Add</button></p>
                
                <div class="field-item" formArrayName="mappings" *ngFor="let mapping of mappings.controls; let i=index">
                    <div class="mapping" [formGroupName]="i">
                        <input formControlName="dir" id="{{'dir' + i}}">
                        <input formControlName="route" id="{{'route' + i}}">
                    </div>
                </div>
            </div>
        </form>
    `,
    styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit {
    optionsForm: FormGroup;

    constructor(private fb: FormBuilder) {

    }

    get mappings(): FormArray {
        return <FormArray>this.optionsForm.get('mappings');
    }

    addMapping() {
        this.mappings.push(this.createMapping())
    }

    createMapping(): FormGroup {
        return this.fb.group({
            dir: '',
            route: '',
        });
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
        });

        this.optionsForm.valueChanges
            .subscribe(x => {
                console.log(x);
            })
    }
}
