import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/addresses/addresses.service';
import { Address } from 'src/app/shared/models/address.model';

@Component({
  selector: 'app-choose-addresses',
  templateUrl: './choose-addresses.component.html',
  styleUrls: ['./choose-addresses.component.scss'],
})
export class ChooseAddressesComponent implements OnInit, OnDestroy {
  addressesSub: Subscription;
  unassignedAddresses: Address[];
  selectedAddresses: Address[] = [];
  amountSelected: number = 0;
  loading: boolean = true;

  constructor(private addressesService: AddressesService) {}

  ngOnInit(): void {
    this.addressesService.getUnassignedAddresses();
    this.addressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((unassignedAddresses) => {
        this.unassignedAddresses = unassignedAddresses;
        this.loading = false;
      });
  }

  onCheckboxClick(address: Address, checked: boolean) {
    if (checked) {
      this.selectedAddresses.push(address);
    } else {
      this.selectedAddresses = this.selectedAddresses.filter(
        (add) => add.id !== address.id
      );
    }
    this.amountSelected = this.selectedAddresses.length;
  }

  ngOnDestroy() {
    this.addressesSub.unsubscribe();
  }
}
