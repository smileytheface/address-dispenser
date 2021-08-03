import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import * as moment from 'moment';

import { Address } from 'src/app/shared/models/address.model';
import { FilterSelection } from 'src/app/shared/models/filter-selection.model';
import { Writer } from 'src/app/shared/models/writer.model';
import { FilterAddressesService } from '../../filter-addresses.service';

@Component({
  selector: 'app-filter-bottom-sheet',
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrls: ['./filter-bottom-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterBottomSheetComponent implements OnInit {
  public filterByOptions: string[] = ['hi', 'hello'];
  public filterBy: string;
  public addresses: Address[] = [];
  public writers: Writer[] = [];
  public filterOptions: any[] = [];
  public filteredFilterOptions: any[] = [];
  public filterSelections: FilterSelection[] = [];

  private _searchTerm: string;
  public get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;

    // searchFilterOptions returns a filtered array of filterOptions based on the search string
    this.filteredFilterOptions =
      this.filterAddressesService.searchFilterOptions(
        this.filterOptions,
        this.filterBy,
        value
      );
  }

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<FilterBottomSheetComponent>,
    private filterAddressesService: FilterAddressesService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.filterByOptions = this.data.filterByOptions;
    this.addresses = this.data.addresses;
    this.writers = this.data.writers;
    this.filterSelections = this.data.filterSelections;
    this.filterBy = this.data.filterBy;

    if (this.filterBy) {
      this.onFilterByChange();
    }

    this.bottomSheetRef.backdropClick().subscribe(() => {
      this.bottomSheetRef.dismiss({
        filterSelections: this.filterSelections,
        filterBy: this.filterBy,
      });
    });
  }

  public onFilterByChange(): void {
    this.filterOptions = this.filterAddressesService.createFilterOptions(
      this.filterBy,
      this.addresses,
      this.writers
    );

    this.filteredFilterOptions = this.filterOptions;

    this.searchTerm = '';
  }

  // When checkbox is changed add that option to an array in a filterSelection
  public onFilterOptionChange(
    filterBy: string,
    filterOption: any,
    checked: boolean
  ) {
    // updateFilterSelection will either add or remove a filterOption from an array of filterSelections
    this.filterSelections = this.filterAddressesService.updateFilterSelections(
      this.filterSelections,
      filterBy,
      filterOption,
      checked
    );
  }

  // Returns boolean indicating if a filterOption is in an array of filterSelections
  isChecked(filterOption: any, filterBy: string): boolean {
    const filterSelectionsIndex = this.filterSelections.findIndex(
      (filterSelection) => filterSelection.filterBy === filterBy
    );
    if (filterSelectionsIndex < 0) {
      return false;
    } else {
      return this.filterSelections[
        filterSelectionsIndex
      ].selectedFilterOptions.includes(filterOption);
    }
  }

  formatOption(option: string): string {
    return this.filterAddressesService.formatFilterBy(option);
  }

  formatFilterOption(option: any): any {
    if (!option) {
      return 'No ' + this.formatOption(this.filterBy);
    } else if (option.name) {
      return option.name;
    } else if (moment(option, moment.ISO_8601, true).isValid()) {
      return this.datePipe.transform(option, 'short');
    } else {
      return option;
    }
  }
}
