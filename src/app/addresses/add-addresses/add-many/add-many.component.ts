import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from '../../../shared/models/address.model';
import { AddressesService } from '../../addresses.service';
import { AddManyConfirmationComponent } from './add-many-confirmation/add-many-confirmation.component';

@Component({
  selector: 'app-add-many',
  templateUrl: './add-many.component.html',
  styleUrls: ['./add-many.component.scss'],
})
export class AddManyComponent implements OnInit {
  addedSuccessfully: boolean;
  successSub: Subscription;
  lastSubmittedAddresses: Address[];
  @ViewChild('addManyForm') form: NgForm;

  constructor(
    public dialog: MatDialog,
    public addressesService: AddressesService,
    public router: Router,
    public _snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Add Addresses | Address Dispenser');
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
          this._snackBar.open('Addresses Added Successfully!', 'Close', {
            duration: 3000,
          });
        }
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const addressStr = form.value.addresses;
    const addressArray: Address[] = this.parseStringIntoAddresses(addressStr);

    let dialogRef = this.dialog.open(AddManyConfirmationComponent, {
      data: addressArray,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed === 'true') {
        this.addressesService.addAddresses(addressArray);
        this.lastSubmittedAddresses = addressArray;
        this.form.resetForm();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/available-addresses']);
  }

  parseStringIntoAddresses(addressString: string): Address[] {
    let splitAddressStrings: string[] = addressString.split(/\r\n|\r|\n/g);
    let addresses: Address[] = [];

    for (let i = 0; i < splitAddressStrings.length; i++) {
      let addressInfoArray = splitAddressStrings[i].split(',');
      let addressPhones: string[] = [];

      for (let y = 6; y < addressInfoArray.length; y++) {
        if (addressInfoArray[y].trim())
          addressPhones.push(addressInfoArray[y].trim());
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
}
