import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/addresses/addresses.service';
import { Address } from 'src/app/shared/models/address.model';
import { EmailData } from 'src/app/shared/models/email-data.model';

import { TextData } from 'src/app/shared/models/text-data.model';
import { SendAddressesService } from '../send-addresses.service';
import { SendConfirmationComponent } from '../send-confirmation/send-confirmation.component';

@Component({
  selector: 'app-custom-send',
  templateUrl: './custom-send.component.html',
  styleUrls: ['./custom-send.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomSendComponent implements OnInit {
  prefersText: boolean;
  addressesSub: Subscription;

  constructor(
    private router: Router,
    private addressesService: AddressesService,
    private dialog: MatDialog,
    private sendAddressesService: SendAddressesService
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const addressAmount = form.value.addressAmount;
    this.addressesService.getUnassignedAddresses();
    this.addressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((availableAddresses) => {
        let addresses: Address[] = availableAddresses;
        let addressesToAssign = availableAddresses.splice(0, addressAmount);
        this.addressesSub.unsubscribe();

        if (this.prefersText) {
          let textData: TextData;
          textData = {
            writerPhone: form.value.phone,
            startComment: form.value.openingComments,
            endComment: form.value.closingComments,
            addresses: addressesToAssign,
            writerId: null,
          };

          let dialogRef = this.dialog.open(SendConfirmationComponent, {
            data: textData,
          });

          dialogRef.afterClosed().subscribe((sendConfirmed) => {
            if (sendConfirmed === 'true') {
              this.sendAddressesService.textAddresses(textData);
            }
          });
        } else {
          let emailData: EmailData;
          emailData = {
            writerEmail: form.value.email,
            startComment: form.value.openingComments,
            endComment: form.value.closingComments,
            addresses: addressesToAssign,
            writerId: null,
            subject: form.value.subject,
          };

          let dialogRef = this.dialog.open(SendConfirmationComponent, {
            data: emailData,
          });

          dialogRef.afterClosed().subscribe((sendConfirmed) => {
            if (sendConfirmed === 'true') {
              this.sendAddressesService.emailAddresses(emailData);
            }
          });
        }
      });
  }

  onCancel() {
    this.router.navigate(['/send-addresses']);
  }
}
