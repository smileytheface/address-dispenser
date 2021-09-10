import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sort-tag',
  templateUrl: './sort-tag.component.html',
  styleUrls: ['./sort-tag.component.scss'],
})
export class SortTagComponent implements OnInit {
  @Input() sortBy: string;
  @Input() ascending: boolean;

  closeClicked = false;

  constructor() {}

  ngOnInit(): void {}
}
