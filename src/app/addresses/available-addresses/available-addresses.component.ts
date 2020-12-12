import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/shared/models/delete-confirmation/delete-confirmation.component';

import { Address } from '../../shared/models/address.model';
import { AddressesService } from '../addresses.service';

@Component({
  selector: 'app-available-addresses',
  templateUrl: './available-addresses.component.html',
  styleUrls: ['./available-addresses.component.scss'],
})
export class AvailableAddressesComponent implements OnInit, OnDestroy {
  availableAddresses: Address[] = [];
  isLoading: boolean = false;
  private addressesSub: Subscription;

  filteredAddresses: Address[];

  private _searchTerm: string;
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredAddresses = this.filterAddresses(value);
  }

  filterAddresses(searchString: string) {
    return this.availableAddresses.filter(
      (address) =>
        address.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
    );
  }

  constructor(
    private addressesService: AddressesService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.addressesService.getAddresses();
    this.isLoading = true;
    this.addressesSub = this.addressesService
      .getAddressesUpdatedListener()
      .subscribe((addresses: Address[]) => {
        this.availableAddresses = addresses.filter(
          (address) => !address.assigned
        );
        this.filteredAddresses = this.availableAddresses;
        this.isLoading = false;
      });
  }

  onAddAddresses() {
    this.router.navigate(['add-addresses'], { relativeTo: this.route });
  }

  onDelete(address: Address) {
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

    let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: { messageTitle: dialogTitle, messageContent: dialogContent },
    });

    dialogRef.afterClosed().subscribe((deletionConfirmed) => {
      if (deletionConfirmed === 'true') {
        this.addressesService.deleteAddress(address);
      }
    });
  }

  onEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.addressesSub.unsubscribe();
  }
}
