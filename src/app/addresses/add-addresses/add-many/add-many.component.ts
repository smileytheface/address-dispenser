import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Address } from '../../../shared/models/address.model';
import { AddressesService } from '../../addresses.service';
import { AddManyConfirmationComponent } from './add-many-confirmation/add-many-confirmation.component';

@Component({
  selector: 'app-add-many',
  templateUrl: './add-many.component.html',
  styleUrls: ['./add-many.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 0.6, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ],
})
export class AddManyComponent implements OnInit {
  addedSuccessfully: boolean;
  successSub: Subscription;
  lastSubmittedAddresses: Address[];
  @ViewChild('addManyForm') form: NgForm;

  constructor(
    public dialog: MatDialog,
    public addressesService: AddressesService
  ) {}

  ngOnInit(): void {
    this.successSub = this.addressesService
      .getAddressesAddedListener()
      .subscribe((addresses) => {
        let addressesMatch: boolean = false;
        for (let i = 0; i < addresses.length; i++) {
          if (addresses[i] === this.lastSubmittedAddresses[i]) {
            addressesMatch = true;
          } else {
            addressesMatch = false;
            break;
          }
        }

        if (addressesMatch) {
          this.addedSuccessfullyMsg();
        }
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log('hey');
      return;
    }

    const addressStr = form.value.addresses;
    const addressArray: Address[] = this.parseStringIntoAddresses(addressStr);

    let dialogRef = this.dialog.open(AddManyConfirmationComponent, {
      data: addressArray,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log(confirmed);
      if (confirmed === 'true') {
        this.addressesService.addAddresses(addressArray);
        this.lastSubmittedAddresses = addressArray;
        this.form.resetForm();
      }
    });
  }

  parseStringIntoAddresses(addressString: string): Address[] {
    let splitAddressStrings: string[] = addressString.split(/\r\n|\r|\n/g);
    let addresses: Address[] = [];

    for (let i = 0; i < splitAddressStrings.length; i++) {
      let addressInfoArray = splitAddressStrings[i].split(',');
      let addressPhones: string[] = [];

      for (let y = 6; y < addressInfoArray.length; y++) {
        addressPhones.push(addressInfoArray[y]);
      }
      let newAddress: Address = {
        id: null,
        name: addressInfoArray[0],
        age: addressInfoArray[1] !== '' ? +addressInfoArray[1] : null,
        street: addressInfoArray[2],
        city: addressInfoArray[3],
        state: addressInfoArray[4],
        zip: addressInfoArray[5],
        phone: addressPhones,
        assigned: false,
        writer: null,
      };

      addresses.push(newAddress);
    }

    return addresses;
  }

  addedSuccessfullyMsg() {
    this.addedSuccessfully = true;
    setTimeout(() => {
      this.addedSuccessfully = false;
    }, 4000);
  }
}
