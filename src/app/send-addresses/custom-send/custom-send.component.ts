import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
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
export class CustomSendComponent implements OnInit, OnDestroy {
  prefersText: boolean;
  addressesSub: Subscription;
  emailData: EmailData;
  messageSentSub: Subscription;
  messageNotSentSub: Subscription;
  @ViewChild('customSendForm') customSendForm: NgForm;

  constructor(
    private router: Router,
    private addressesService: AddressesService,
    private dialog: MatDialog,
    private sendAddressesService: SendAddressesService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.sendAddressesService.sharedEmailData) {
      this.prefersText = false;
      let emailData = this.sendAddressesService.sharedEmailData;
      let formData = {
        email: emailData.writerEmail,
        subject: emailData.subject,
        startComment: emailData.startComment,
        addressAmount: emailData.addresses.length,
        closingComments: emailData.endComment,
      };
      setTimeout(() => {
        this.customSendForm.setValue(formData);
        this.sendAddressesService.sharedEmailData = null;
      });
    } else if (this.sendAddressesService.sharedTextData) {
      this.prefersText = true;
      let textData = this.sendAddressesService.sharedTextData;
      let formData = {
        phone: textData.writerPhone,
        startComment: textData.startComment,
        addressAmount: textData.addresses.length,
        closingComments: textData.endComment,
      };
      setTimeout(() => {
        this.customSendForm.setValue(formData);
        this.sendAddressesService.sharedTextData = null;
      });
    }

    // Alert user when message is sent successfully
    this.messageSentSub = this.sendAddressesService
      .getMesageSentListener()
      .subscribe((message: string) => {
        this.openSnackBar(message, 'Okay');
      });

    // Alert for errors in sending message
    this.messageNotSentSub = this.sendAddressesService
      .getMessageNotSentListener()
      .subscribe((message: string) => {
        this.openSnackBar(message, 'Okay');
      });
  }

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
            startComment: form.value.startComment,
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngOnDestroy() {
    this.messageSentSub.unsubscribe();
    this.messageNotSentSub.unsubscribe();
  }
}
