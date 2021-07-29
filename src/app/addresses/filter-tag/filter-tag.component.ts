import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-tag',
  templateUrl: './filter-tag.component.html',
  styleUrls: ['./filter-tag.component.scss'],
})
export class FilterTagComponent implements OnInit {
  @Input() filterBy: string;
  @Input() filterOptionsCount: number;
  @Output() close = new EventEmitter();
  @Output() tagClick = new EventEmitter();
  closeClicked = false;

  constructor() {}

  onClick() {
    if (!this.closeClicked) {
      if (this.filterBy) {
        this.tagClick.emit();
      }
    } else {
      this.closeClicked = false;
    }
  }

  onClose() {
    this.closeClicked = true;
    this.close.emit();
  }

  ngOnInit(): void {}
}
