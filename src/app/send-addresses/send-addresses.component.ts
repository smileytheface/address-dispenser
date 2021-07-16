import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AddressesService } from '../addresses/addresses.service';
import { WritersService } from '../writers/writers.service';
import { SendAddressesService } from './send-addresses.service';

import { Address } from '../shared/models/address.model';
import { Writer } from '../shared/models/writer.model';
import { TextData } from '../shared/models/text-data.model';
import { MatDialog } from '@angular/material/dialog';
import { SendConfirmationComponent } from './send-confirmation/send-confirmation.component';
import { EmailData } from '../shared/models/email-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-send-addresses',
  templateUrl: './send-addresses.component.html',
  styleUrls: ['./send-addresses.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SendAddressesComponent implements OnInit, OnDestroy {
  writers: Writer[] = [];
  filteredWriters: Writer[];
  isLoading: boolean = false;
  writersSub: Subscription;
  addressesSub: Subscription;
  messageSentSub: Subscription;
  messageNotSentSub: Subscription;
  startComment: string = 'Here you go!';
  endComment: string = 'Sent from Address Dispenser!';
  subject: string = 'Your Addresses';
  private _searchTerm: string;

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredWriters = this.filterWriters(value);
  }

  filterWriters(searchString: string) {
    return this.writers.filter(
      (address) =>
        address.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1
    );
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private writersService: WritersService,
    private addressesService: AddressesService,
    private sendAddressesService: SendAddressesService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Send Addresses | Address Dispenser');
    this.writersService.getWriters();
    this.isLoading = true;
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers: Writer[]) => {
        this.writers = writers;
        this.filteredWriters = this.writers;
        this.isLoading = false;
      });

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
    const addressAmount = writer.defaultAddressAmount;
    const writerId = writer.id;
    const writerName = writer.name;
    const writerPhone = writer.phone;
    const writerEmail = writer.email;
    const prefersText = writer.prefersText;
    this.addressesService.getUnassignedAddresses();
    this.addressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((unassignedAddresses) => {
        let availableAddresses: Address[] = unassignedAddresses;
        this.addressesSub.unsubscribe();

        if (availableAddresses.length < addressAmount) {
          this.openSnackBar(
            'Cannot send, not enough available addresses',
            'Okay'
          );
          return;
        }

        let addressesToAssign = availableAddresses.splice(0, addressAmount);

        if (writer.prefersText) {
          let textData: TextData;
          textData = {
            writerPhone: writerPhone,
            startComment: this.startComment,
            endComment: this.endComment,
            addresses: addressesToAssign,
            writerId: writerId,
          };

          let dialogRef = this.dialog.open(SendConfirmationComponent, {
            data: { messageData: textData, writerName: writerName },
          });

          dialogRef.afterClosed().subscribe((sendConfirmed) => {
            if (sendConfirmed === 'true') {
              this.sendAddressesService.textAddresses(textData);
            } else if (sendConfirmed === 'edit') {
              this.sendAddressesService.sharedTextData = textData;
              this.router.navigate(['custom-send'], { relativeTo: this.route });
            }
          });
        } else {
          let emailData: EmailData;
          emailData = {
            writerEmail: writerEmail,
            startComment: this.startComment,
            endComment: this.endComment,
            addresses: addressesToAssign,
            writerId: writerId,
            subject: this.subject,
          };

          let dialogRef = this.dialog.open(SendConfirmationComponent, {
            data: { messageData: emailData, writerName: writerName },
          });

          dialogRef.afterClosed().subscribe((sendConfirmed) => {
            if (sendConfirmed === 'true') {
              this.sendAddressesService.emailAddresses(emailData);
            } else if (sendConfirmed === 'edit') {
              this.sendAddressesService.sharedEmailData = emailData;
              this.router.navigate(['custom-send'], { relativeTo: this.route });
            }
          });
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngOnDestroy() {
    this.writersSub.unsubscribe();
    this.messageSentSub.unsubscribe();
    this.messageNotSentSub.unsubscribe();
  }
}
