import { Component, OnDestroy, OnInit } from '@angular/core';
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
  startComment: string = 'Here you go!';
  endComment: string = 'Sent from Address Dispenser!';
  subject: string = 'Your Addresses';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private writersService: WritersService,
    private addressesService: AddressesService,
    private sendAddressesService: SendAddressesService,
    private dialog: MatDialog
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
    const addressAmount = writer.defaultAddressAmount;
    const writerId = writer.id;
    const writerPhone = writer.phone;
    const writerEmail = writer.email;
    const prefersText = writer.prefersText;
    this.addressesService.getUnassignedAddresses();
    this.addressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((unassignedAddresses) => {
        let availableAddresses: Address[] = unassignedAddresses;
        let addressesToAssign = availableAddresses.splice(0, addressAmount);
        this.addressesSub.unsubscribe();

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
            writerEmail: writerEmail,
            startComment: this.startComment,
            endComment: this.endComment,
            addresses: addressesToAssign,
            writerId: writerId,
            subject: this.subject,
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

  getUnassignedAddressesTest() {
    let availableAddresses: Address[] = [];
    let addressesToAssign: Address[] = [];
    this.addressesService.getUnassignedAddresses();
    this.addressesSub = this.addressesService
      .getUnassignedAddressesUpdatedListener()
      .subscribe((unassignedAddresses) => {
        availableAddresses = unassignedAddresses;
        console.log(availableAddresses);
        this.addressesSub.unsubscribe();
      });
  }

  ngOnDestroy() {
    this.writersSub.unsubscribe();
  }
}
