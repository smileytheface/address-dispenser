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
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AddressesService } from 'src/app/addresses/addresses.service';
import { Address } from 'src/app/shared/models/address.model';
import { EmailData } from 'src/app/shared/models/email-data.model';

import { TextData } from 'src/app/shared/models/text-data.model';
import { SendAddressesService } from '../send-addresses.service';
import { SendConfirmationComponent } from '../send-confirmation/send-confirmation.component';
import { ChooseAddressesComponent } from '../choose-addresses/choose-addresses.component';

@Component({
  selector: 'app-custom-send',
  templateUrl: './custom-send.component.html',
  styleUrls: ['./custom-send.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomSendComponent implements OnInit, OnDestroy {
  prefersEmail: boolean;
  addressesSub: Subscription;
  emailData: EmailData;
  messageSentSub: Subscription;
  messageNotSentSub: Subscription;
  writerId: string = null;
  manuallySelect: boolean;
  chosenAddresses: Address[] = [];
  @ViewChild('customSendForm') customSendForm: NgForm;

  constructor(
    private router: Router,
    private addressesService: AddressesService,
    private dialog: MatDialog,
    private sendAddressesService: SendAddressesService,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Custom Send | Address Dispenser');
    if (
      this.sendAddressesService.sharedEmailData ||
      this.sendAddressesService.sharedTextData
    ) {
      this.titleService.setTitle('Edit Message | Address Dispenser');
    }

    // Checking if message is email or text when editing a message
    if (this.sendAddressesService.sharedEmailData) {
      this.prefersEmail = true;
      let emailData = this.sendAddressesService.sharedEmailData;
      let formData = {
        email: emailData.writerEmail,
        subject: emailData.subject,
        startComment: emailData.startComment,
        manuallySelect: false,
        addressAmount: emailData.addresses.length,
        closingComments: emailData.endComment,
      };
      this.writerId = emailData.writerId;
      setTimeout(() => {
        this.customSendForm.setValue(formData);
        this.sendAddressesService.sharedEmailData = null;
      });
    } else if (this.sendAddressesService.sharedTextData) {
      this.prefersEmail = false;
      let textData = this.sendAddressesService.sharedTextData;
      let formData = {
        phone: textData.writerPhone,
        startComment: textData.startComment,
        manuallySelect: false,
        addressAmount: textData.addresses.length,
        closingComments: textData.endComment,
      };
      this.writerId = textData.writerId;
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
    let addressesToAssign: Address[];
    if (form.value.manuallySelect) {
      addressesToAssign = this.chosenAddresses;
      this.sendAddresses(addressesToAssign, form);
    } else {
      this.addressesService.getUnassignedAddresses();
      this.addressesSub = this.addressesService
        .getUnassignedAddressesUpdatedListener()
        .subscribe((addresses) => {
          this.addressesSub.unsubscribe();
          addressesToAssign = addresses.splice(0, form.value.addressAmount);
          this.sendAddresses(addressesToAssign, form);
        });
    }
  }

  onManuallySelect() {
    let dialogRef = this.dialog.open(ChooseAddressesComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((selectedAddresses) => {
      if (selectedAddresses) this.chosenAddresses = selectedAddresses;
    });
  }

  sendAddresses(addresses: Address[], form: NgForm) {
    if (!this.prefersEmail) {
      // Texting addresses
      let textData: TextData;
      textData = {
        writerPhone: form.value.phone,
        startComment: form.value.startComment,
        endComment: form.value.closingComments,
        addresses: addresses,
        writerId: this.writerId,
      };

      let dialogRef = this.dialog.open(SendConfirmationComponent, {
        data: {
          messageData: textData,
          writerName: this.sendAddressesService.sharedWriterName,
          customSend: true,
        },
      });

      dialogRef.afterClosed().subscribe((sendConfirmed) => {
        if (sendConfirmed === 'true') {
          this.sendAddressesService.textAddresses(textData);
          this.chosenAddresses = [];
        }
      });
    } else {
      // Emailing addresses
      let emailData: EmailData;
      emailData = {
        writerEmail: form.value.email,
        startComment: form.value.startComment,
        endComment: form.value.closingComments,
        addresses: addresses,
        writerId: this.writerId,
        subject: form.value.subject,
      };

      let dialogRef = this.dialog.open(SendConfirmationComponent, {
        data: {
          messageData: emailData,
          writerName: this.sendAddressesService.sharedWriterName,
          customSend: true,
        },
      });

      dialogRef.afterClosed().subscribe((sendConfirmed) => {
        if (sendConfirmed === 'true') {
          this.sendAddressesService.emailAddresses(emailData);
          this.chosenAddresses = [];
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/send-addresses']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngOnDestroy() {
    this.sendAddressesService.sharedWriterName = null;
    this.messageSentSub.unsubscribe();
    this.messageNotSentSub.unsubscribe();
  }
}
