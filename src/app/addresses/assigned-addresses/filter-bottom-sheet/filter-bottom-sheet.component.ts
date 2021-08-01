import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import * as moment from 'moment';

import { Address } from 'src/app/shared/models/address.model';
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
  }

  public onFilterByChange(): void {
    this.filterOptions = this.filterAddressesService.createFilterOptions(
      this.filterBy,
      this.addresses,
      this.writers
    );
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

  filterSelect(writer: string) {
    this.bottomSheetRef.dismiss(writer);
  }
}
