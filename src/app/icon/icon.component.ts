import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
      <button type="button" class="icon-button" (click)="handleClick()">
          <i class="material-icons">{{name}}</i>
      </button>
  `,
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {

  @Input() press: Function;
  @Input() name;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  handleClick(event: any) {
      this.onClick.emit(event);
  }

  ngOnInit() {}
}
