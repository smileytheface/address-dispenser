import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { FilterAddressesService } from '../../filter-addresses.service';

@Component({
  selector: 'app-filter-bottom-sheet',
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrls: ['./filter-bottom-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterBottomSheetComponent implements OnInit {
  public filterByOptions: string[] = ['hi', 'hello'];
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<FilterBottomSheetComponent>,
    private filterAddressesService: FilterAddressesService
  ) {}

  ngOnInit(): void {
    this.filterByOptions = this.data.filterByOptions;
  }

  formatOption(option: string): string {
    return this.filterAddressesService.formatFilterBy(option);
  }

  filterSelect(writer: string) {
    this.bottomSheetRef.dismiss(writer);
  }
}
