import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from '@angular/cdk/overlay/overlay-directives';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Address } from '../../../shared/models/address.model';
import { AddManyConfirmationComponent } from './add-many-confirmation/add-many-confirmation.component';

@Component({
  selector: 'app-add-many',
  templateUrl: './add-many.component.html',
  styleUrls: ['./add-many.component.scss'],
})
export class AddManyComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log('hey');
      return;
    }

    const addressStr = form.value.addresses;
    // const addressStr =
    //   'Tom Hornet,222 Mayher Drive,Red Wood,IN,12992,555-555-5555,555-555-1234\nJosh Gordon,122 Eagle Rd,Chicago,IL,66045,555-555-2342';
    const addressArray: Address[] = this.parseStringIntoAddresses(addressStr);

    let dialogRef = this.dialog.open(AddManyConfirmationComponent, {
      data: addressArray,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log(confirmed);
      if (confirmed === 'true') {
        console.log(addressArray);
      }
    });
  }

  parseStringIntoAddresses(addressString: string): Address[] {
    let splitAddressStrings: string[] = addressString.split(/\r\n|\r|\n/g);
    let addresses: Address[] = [];

    for (let i = 0; i < splitAddressStrings.length; i++) {
      let addressInfoArray = splitAddressStrings[i].split(',');
      let addressPhones: string[] = [];

      for (let y = 5; y < addressInfoArray.length; y++) {
        addressPhones.push(addressInfoArray[y]);
      }
      let newAddress: Address = {
        id: null,
        name: addressInfoArray[0],
        street: addressInfoArray[1],
        city: addressInfoArray[2],
        state: addressInfoArray[3],
        zip: addressInfoArray[4],
        phone: addressPhones,
        assigned: false,
        writer: null,
      };

      addresses.push(newAddress);
    }

    return addresses;
  }
}
