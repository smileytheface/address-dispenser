import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-tag',
  templateUrl: './filter-tag.component.html',
  styleUrls: ['./filter-tag.component.scss'],
})
export class FilterTagComponent implements OnInit {
  @Input() filterBy: string;
  @Input() filterOptionsCount: number;

  constructor() {}

  ngOnInit(): void {}
}
