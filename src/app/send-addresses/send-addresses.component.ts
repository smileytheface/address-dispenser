import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressesService } from '../addresses/addresses.service';
import { Address } from '../shared/models/address.model';

import { Writer } from '../shared/models/writer.model';
import { WritersService } from '../writers/writers.service';

@Component({
  selector: 'app-send-addresses',
  templateUrl: './send-addresses.component.html',
  styleUrls: ['./send-addresses.component.scss'],
})
export class SendAddressesComponent implements OnInit, OnDestroy {
  writers: Writer[] = [];
  isLoading: boolean = false;
  writersSub: Subscription;
  addressesSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private writersService: WritersService,
    private addressesService: AddressesService
  ) {}

  ngOnInit(): void {
    this.writersService.getWriters();
    this.isLoading = true;
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers: Writer[]) => {
        this.writers = writers;
        this.isLoading = false;
      });
  }

  onCustomSend() {
    this.router.navigate(['custom-send'], { relativeTo: this.route });
  }

  onAddWriter() {
    this.router.navigate(['/writers/add-writer']);
  }

  onEdit(id: string) {
    this.router.navigate(['/writers/edit', id]);
  }

  onSend(writer: Writer) {
    // let addressToAssigne;
  }

  getUnassignedAddressesTest() {
    let availableAddresses: Address[] = [];
    let addressesToAssign: Address[] = [];
    this.addressesService.getUnassignedAddresses();
    this.addressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((unassignedAddresses) => {
        availableAddresses = unassignedAddresses;
        console.log(availableAddresses);
      });
  }

  ngOnDestroy() {
    this.writersSub.unsubscribe();
  }
}
