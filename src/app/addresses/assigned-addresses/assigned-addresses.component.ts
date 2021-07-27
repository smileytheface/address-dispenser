import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  Component,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/shared/delete-confirmation/delete-confirmation.component';
import { WritersService } from 'src/app/writers/writers.service';
import { AddressesService } from '../addresses.service';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, SlicePipe } from '@angular/common';
import * as moment from 'moment';

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
    this.filterOptionsSearchResults = this.searchFilterOptions(value);
  }

  // returns filter options that match the search string
  searchFilterOptions(searchString: string) {
    // If searching for a writer name
    if (this.filterOptions[0].name) {
      return this.filterOptions.filter(
        (filterOption) =>
          filterOption.name
            .toString()
            .toLowerCase()
            .indexOf(searchString.toLowerCase()) !== -1
      );
    }

    // If searching anything that's not a writer name
    return this.filterOptions.filter(
      (filterOption) =>
        filterOption
          .toString()
          .toLowerCase()
          .indexOf(searchString.toLowerCase()) !== -1
    );
  }

  mobile: boolean;
  // tempCounter: number = 0;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet,
    private addressesService: AddressesService,
    private writersService: WritersService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
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

  // // gets called as the html loops through each writer
  // // gets all addresses that are assigned to the given writer
  // addressesByName(writer: Writer): Address[] {
  //   let writersAddresses: Address[] = [];
  //   let allAddresses: Address[] = this.assignedAddresses;

  //   allAddresses.forEach((address) => {
  //     if (
  //       (address.writer && address.writer === writer.id) ||
  //       (writer.name === 'Other' && !address.writer && address.assigned)
  //     ) {
  //       writersAddresses.push(address);
  //     }
  //   });

  //   return writersAddresses;
  // }

  getWriter(writerId: string) {
    return this.writers.find((writer) => writer.id === writerId);
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
      data: this.writers,
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
    // https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript?page=1&tab=votes#tab-top
    // https://stackoverflow.com/questions/4149276/how-to-convert-camelcase-to-camel-case
    // Adds space between cammel case and makes makes options Title Case
    if (option) {
      return option.replace(/([A-Z])/g, ' $1').replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }

  // When filter by select is changed
  onSelectionChange() {
    let options = [];

    // When adding writers to options, set the options to writers objects themselves that get fetched on init
    if (this.filterBy === 'writer') {
      options = this.writers;
    } else if (this.filterBy === 'phone') {
      // If filtering by phone number, get all phone numbers
      for (let address of this.assignedAddresses) {
        if (address.phone.length > 0) {
          for (let phone of address.phone) {
            options.push(phone);
          }
        } else {
          options.push('No ' + this.formatFilterByOption(this.filterBy));
        }
      }
    } else if (this.filterBy === 'dateAssigned') {
      // If filtering by date assigned, get the last date assigned for all addresses with assignment history
      for (let address of this.assignedAddresses) {
        if (address.assignmentHistory && address.assignmentHistory.length > 0) {
          options.push(
            address.assignmentHistory[address.assignmentHistory.length - 1].date
          );
        } else {
          options.push('No ' + this.formatFilterByOption(this.filterBy));
        }
      }
    } else {
      for (let address of this.assignedAddresses) {
        // Adding all address.filterBy fields
        // For example if filterBy is name, this will go through all addresses and add address.name to options
        // Any duplicates get removed later with the spread operator
        if (!address[this.filterBy]) {
          // If the property is null, push No {{ filterBy }}
          options.push('No ' + this.formatFilterByOption(this.filterBy));
        } else if (this.filterBy === 'dateCreated') {
          options.push(
            this.datePipe.transform(address[this.filterBy], 'short')
          );
        } else {
          options.push(address[this.filterBy]);
        }
      }
    }

    this.filterOptions = [...new Set(options)];

    // Adding the filter options to the array that get changed when searching
    this.filterOptionsSearchResults = this.filterOptions;
  }

  // When checkbox is changed add that option to an array in a filterSelection
  onFilterOptionChange(filterBy: string, filterOption: any, checked: boolean) {
    // If there is already a filterSelection for that filterBy option, store the index of that filterSelection for later
    const filterSelectionsIndex = this.filterSelections.findIndex(
      (filterSelection) => filterSelection.filterBy === filterBy
    );

    if (checked) {
      // If the option was checked...
      if (filterSelectionsIndex < 0) {
        const newFilterSelection: FilterSelection = {
          filterBy: filterBy,
          selectedFilterOptions: [filterOption],
        };

        this.filterSelections.push(newFilterSelection);
      } else {
        this.filterSelections[filterSelectionsIndex].selectedFilterOptions.push(
          filterOption
        );
      }
    } else {
      // If the option was unchecked
      if (filterSelectionsIndex < 0) {
        console.error('Option was not already checked');
      } else {
        // remove that filter option from the filterSelection's array
        this.filterSelections[filterSelectionsIndex].selectedFilterOptions =
          this.filterSelections[
            filterSelectionsIndex
          ].selectedFilterOptions.filter(
            (filOption) => filOption !== filterOption
          );

        // If the filterSelection has no more filterOptions selected, remove it from the filterSelection array
        if (
          this.filterSelections[filterSelectionsIndex].selectedFilterOptions
            .length < 1
        ) {
          this.filterSelections.splice(filterSelectionsIndex, 1);
        }
      }
    }

    console.log(this.filterSelections);

    // if (checked) {
    //   this.filterSelections = addFilterOption(this.filterSelections, filterBy, filterOption);
    // } else {
    //   this.filterSelections = removeFilterOption(this.filterSelections, filterBy, filterOption)
    // }
  }

  // Returns boolean indicating if filterOption is in a filterSelection already
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

  formatFilterOption(option: any) {
    if (option.name) {
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
