import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
      <button type="button" [class]="classes" (click)="handleClick()">
          <i class="material-icons">{{name}}</i>
      </button>
  `,
  styles: [`
      
      :host {
          display: inline-block;
          line-height: 1;
          font-size: 0;
      }
      :host .icon-button {
          width: 40px;
          height: 40px;
          background: none;
          border: 0;
          cursor: pointer;
          padding: 0;
          margin: 0;
          line-height: 1;
          outline: 0;
      }
  `]
})
export class IconComponent implements OnInit {

  public classes = 'icon-button';
  @Input() press: Function;
  @Input() name;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  handleClick(event: any) {
      this.onClick.emit(event);
  }

  ngOnInit() {}
}
