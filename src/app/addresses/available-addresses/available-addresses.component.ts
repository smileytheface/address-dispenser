import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Address } from '../../shared/models/address.model';
import { AddressesService } from '../addresses.service';

@Component({
  selector: 'app-available-addresses',
  templateUrl: './available-addresses.component.html',
  styleUrls: ['./available-addresses.component.scss'],
})
export class AvailableAddressesComponent implements OnInit, OnDestroy {
  addresses: Address[] = [];
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
    return this.addresses.filter(
      (address) =>
        address.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
    );
  }

  constructor(
    private addressesService: AddressesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addressesService.getAddresses();
    this.isLoading = true;
    this.addressesSub = this.addressesService
      .getAddressesUpdatedListener()
      .subscribe((addresses: Address[]) => {
        this.addresses = addresses;
        this.filteredAddresses = this.addresses;
        this.isLoading = false;
      });
  }

  onAddAddresses() {
    this.router.navigate(['add-addresses'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.addressesSub.unsubscribe();
  }
}
