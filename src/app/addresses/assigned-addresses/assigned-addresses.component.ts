import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/shared/delete-confirmation/delete-confirmation.component';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import { WritersService } from 'src/app/writers/writers.service';
import { AddressesService } from '../addresses.service';
import { FilterAddressesService } from '../filter-addresses.service';
import { Writer } from 'src/app/shared/models/writer.model';
import { Address } from 'src/app/shared/models/address.model';
import { FilterSelection } from 'src/app/shared/models/filter-selection.model';

@Component({
  selector: 'app-assigned-addresses',
  templateUrl: './assigned-addresses.component.html',
  styleUrls: ['./assigned-addresses.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssignedAddressesComponent implements OnInit, OnDestroy {
  writers: Writer[] = [];
  filterByOptions: string[] = [
    'writer',
    'name',
    'age',
    'street',
    'city',
    'state',
    'zip',
    'phone',
    'dateCreated',
    'dateAssigned',
  ];

  other: Writer = {
    id: null,
    name: 'Other',
    email: null,
    phone: null,
    prefersText: null,
    defaultAddressAmount: null,
    totalCheckedOut: null,
    color: null,
  };

  // Options to filter such as a list of writer names or a list of address names
  filterOptions: any[] = [];
  // Array for results when searching filteroptions
  filterOptionsSearchResults: string[] = [];

  // Array to hold what filter options are selected
  filterSelections: FilterSelection[] = [];

  assignedAddresses: Address[] = [];
  filteredAssignedAddresses: Address[] = [];

  filteredWriters: Writer[];
  filterBy: string;

  private assignedAddressesSub: Subscription;
  private writersSub: Subscription;
  private allAddressesSub: Subscription;
  private unassignedAddressesSub: Subscription;

  loading: boolean = false;
  addressesLoading: boolean = false;
  writersLoading: boolean = false;

  private _searchTerm: string;
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    // searchFilterOptions returns a filtered array of filterOptions based on the search string
    this.filterOptionsSearchResults =
      this.filterAddressesService.searchFilterOptions(
        this.filterOptions,
        this.filterBy,
        value
      );
  }

  mobile: boolean;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet,
    private addressesService: AddressesService,
    private writersService: WritersService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private filterAddressesService: FilterAddressesService
  ) {}

  ngOnInit(): void {
    this.addressesService.getAssignedAddresses();
    this.writersService.getWriters();
    this.loading = true;

    this.writersLoading = true;
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers) => {
        this.writers = writers;
        this.writers.push(this.other);
        this.filteredWriters = this.writers;
        this.writersLoading = false;
        this.checkLoad();
      });

    // getting assigned addresses and putting them in a local array
    this.addressesLoading = true;
    this.assignedAddressesSub = this.addressesService
      .getAssignedAddressesUpdatedListener()
      .subscribe((assignedAddresses) => {
        this.assignedAddresses = assignedAddresses;
        this.filteredAssignedAddresses = assignedAddresses;
        this.addressesLoading = false;

        this.checkLoad();
      });

    // acts as a media query for showing 'filter by writer' on the side or as a button
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = true;
        } else {
          this.mobile = false;
        }
      });

    // alerting user when address is successfully unassigned
    this.unassignedAddressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((addresses) => {
        this.snackBar.open('Address successfully unassigned', 'Okay', {
          duration: 3000,
        });
      });
  }

  getWriter(writerId: string) {
    return this.writers.find((writer) => writer.id === writerId);
  }

  onFilterClick(filterBy: string) {
    this.filterBy = filterBy;
    this.onSelectionChange();
  }

  onFilterClose(index: number) {
    this.filterSelections.splice(index, 1);
    this.filteredAssignedAddresses =
      this.filterAddressesService.filterAddresses(
        this.assignedAddresses,
        this.filterSelections
      );
  }

  onEdit(address: Address) {
    this.router.navigate(['/available-addresses/edit', address.id]);
  }

  onAddAddresses() {
    this.router.navigate(['/available-addresses/add-addresses/add-one']);
  }

  onDelete(address: Address) {
    this.addressesService.getAddresses();
    const dialogTitle =
      'Are you sure you would like to delete the following address?';
    const dialogContent =
      address.name +
      (address.age ? ' (Age: ' + address.age + ') ' : '') +
      '<br/>' +
      address.street +
      '<br/>' +
      address.city +
      ', ' +
      address.state +
      ' ' +
      address.zip;

    this.allAddressesSub = this.addressesService
      .getAddressesUpdatedListener()
      .subscribe(() => {
        let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
          data: { messageTitle: dialogTitle, messageContent: dialogContent },
        });

        dialogRef.afterClosed().subscribe((deletetionConfirmed) => {
          this.allAddressesSub.unsubscribe();
          if (deletetionConfirmed === 'true') {
            this.addressesService.deleteAddress(address);
          }
        });
      });

    // this.addressesService.getAddresses();
    // this.addressesService.filterTest();
  }

  onUnassign(addressId: string, writerId: string) {
    this.addressesService.unassignAddress(addressId, writerId);
  }

  filter(name: string) {
    this.searchTerm = name;
  }

  clearFilter() {
    this.searchTerm = '';
  }

  openBottomSheet() {
    let sheet = this.bottomSheet.open(FilterBottomSheetComponent, {
      data: {
        filterByOptions: this.filterByOptions,
        addresses: this.assignedAddresses,
        writers: this.writers,
      },
    });

    sheet.afterDismissed().subscribe((writer) => {
      this.searchTerm = writer;
    });
  }

  checkLoad() {
    if (!this.addressesLoading && !this.writersLoading) {
      this.loading = false;
    }
  }

  // formatting options
  formatFilterByOption(option) {
    // Formats filterBy (which should be in camelCase) and converts it to Title Case
    return this.filterAddressesService.formatFilterBy(option);
  }

  // When filter by select is changed
  onSelectionChange() {
    // createFilterOptions returns an array of filter options based on
    // what you are filtering by, and what properties are present in addresses
    this.filterOptions = this.filterAddressesService.createFilterOptions(
      this.filterBy,
      this.assignedAddresses,
      this.writers
    );

    // Adding the filter options to the array that get changed when searching
    this.filterOptionsSearchResults = this.filterOptions;

    this.searchTerm = '';
  }

  // When checkbox is changed add that option to an array in a filterSelection
  onFilterOptionChange(filterBy: string, filterOption: any, checked: boolean) {
    // updateFilterSelection will either add or remove a filterOption from an array of filterSelections
    this.filterSelections = this.filterAddressesService.updateFilterSelections(
      this.filterSelections,
      filterBy,
      filterOption,
      checked
    );

    // filterAddresses takes an array of addresses and an array of filter selections and
    // returns an array of addresses that match the filter selection options
    this.filteredAssignedAddresses =
      this.filterAddressesService.filterAddresses(
        this.assignedAddresses,
        this.filterSelections
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

  formatFilterOption(option: any): any {
    if (!option) {
      return 'No ' + this.formatFilterByOption(this.filterBy);
    } else if (option.name) {
      return option.name;
    } else if (moment(option, moment.ISO_8601, true).isValid()) {
      return this.datePipe.transform(option, 'short');
    } else {
      return option;
    }
  }

  ngOnDestroy() {
    this.assignedAddressesSub.unsubscribe();
    this.writersSub.unsubscribe();
    if (this.allAddressesSub) {
      this.allAddressesSub.unsubscribe();
    }
    this.unassignedAddressesSub.unsubscribe();
  }
}
