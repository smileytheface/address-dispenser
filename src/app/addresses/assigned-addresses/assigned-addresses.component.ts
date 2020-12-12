import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';
import { Address } from 'src/app/shared/models/address.model';
import { DeleteConfirmationComponent } from 'src/app/shared/models/delete-confirmation/delete-confirmation.component';
import { Writer } from 'src/app/shared/models/writer.model';
import { WritersService } from 'src/app/writers/writers.service';
import { AddressesService } from '../addresses.service';
import { FilterBottomSheetComponent } from './filter-bottom-sheet/filter-bottom-sheet.component';

@Component({
  selector: 'app-assigned-addresses',
  templateUrl: './assigned-addresses.component.html',
  styleUrls: ['./assigned-addresses.component.scss'],
})
export class AssignedAddressesComponent implements OnInit, OnDestroy {
  writers: Writer[] = [];

  assignedAddresses: Address[] = [];

  filteredWriters: Writer[];

  private assignedAddressesSub: Subscription;
  private writersSub: Subscription;
  private allAddressesSub: Subscription;

  loading: boolean = false;
  addressesLoading: boolean = false;
  writersLoading: boolean = false;

  private _searchTerm: string;
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredWriters = this.filterWriters(value);
  }

  filterWriters(searchString: string) {
    return this.writers.filter(
      (writer) =>
        writer.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
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
    public dialog: MatDialog
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
        this.filteredWriters = this.writers;
        this.writersLoading = false;
        this.checkLoad();
      });

    this.addressesLoading = true;
    this.assignedAddressesSub = this.addressesService
      .getAssignedAddressesUpdatedListener()
      .subscribe((assignedAddresses) => {
        this.assignedAddresses = assignedAddresses;
        this.addressesLoading = false;
        this.checkLoad();
      });

    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.mobile = true;
        } else {
          this.mobile = false;
        }
      });
  }

  addressesByName(writer: Writer): Address[] {
    let writersAddresses: Address[] = [];
    let allAddresses: Address[] = this.assignedAddresses;

    allAddresses.forEach((address) => {
      if (address.writer && address.writer === writer.id) {
        writersAddresses.push(address);
      }
    });
    return writersAddresses;
  }

  onEdit(address: Address) {
    this.router.navigate(['/available-addresses/edit', address.id]);
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

  ngOnDestroy() {
    this.assignedAddressesSub.unsubscribe();
    this.writersSub.unsubscribe();
    if (this.allAddressesSub) {
      this.allAddressesSub.unsubscribe();
    }
  }
}
