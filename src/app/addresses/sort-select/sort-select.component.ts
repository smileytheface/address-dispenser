import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sort-select',
  templateUrl: './sort-select.component.html',
  styleUrls: ['./sort-select.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class SortSelectComponent implements OnInit {
  ascending: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  public toggleAscending(): void {
    this.ascending = !this.ascending;
  }

  public getAscendingTitle(): string {
    return this.ascending ? 'Ascending' : 'Descending';
  }
}
