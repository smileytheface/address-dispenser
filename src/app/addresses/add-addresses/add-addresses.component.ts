import { animate, style, transition, trigger } from '@angular/animations';
import { formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Form,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { AddressesService } from '../addresses.service';

@Component({
  selector: 'app-add-addresses',
  templateUrl: './add-addresses.component.html',
  styleUrls: ['./add-addresses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // animation taken from https://indepth.dev/in-depth-guide-into-animations-in-angular/
  // author: William Tjondrosuharto
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
export class AddAddressesComponent implements OnInit, OnDestroy {
  addMany = false;
  lastSubmittedAddress: Address;
  addressSuccessfullyAdded: boolean = false;
  addressAddedSub: Subscription;
  phoneNumbers: FormArray = new FormArray([]);

  addressForm: FormGroup;

  constructor(private addressesService: AddressesService) {}

  ngOnInit(): void {
    this.initForm();

    this.addressAddedSub = this.addressesService
      .getAddressAddedListener()
      .subscribe((address) => {
        if (address === this.lastSubmittedAddress) {
          this.showAddressAddedMessage();
        } else {
          return;
        }
      });
  }

  initForm() {
    this.addressForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      zip: new FormControl(null, Validators.required),
      phone: this.phoneNumbers,
    });
  }

  get phoneControls() {
    return (<FormArray>this.addressForm.get('phone')).controls;
  }

  onAddPhoneNumber() {
    (<FormArray>this.addressForm.get('phone')).push(new FormControl());
  }

  onRemovePhone(index: number) {
    (<FormArray>this.addressForm.get('phone')).removeAt(index);
  }

  onSubmit() {
    console.log(this.addressForm);

    if (this.addressForm.invalid) {
      return;
    }

    const newAddress: Address = {
      id: null,
      name: this.addressForm.value.name,
      street: this.addressForm.value.street,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      zip: this.addressForm.value.zip,
      phone: this.addressForm.value.phone,
      assigned: false,
      writer: null,
    };

    console.log(newAddress);

    this.addressesService.addAddress(newAddress);
    this.lastSubmittedAddress = newAddress;
    this.addressForm.reset();
  }

  showAddressAddedMessage() {
    this.addressSuccessfullyAdded = true;
    setTimeout(() => {
      this.addressSuccessfullyAdded = false;
    }, 4000);
  }

  ngOnDestroy() {
    this.addressAddedSub.unsubscribe();
  }
}
