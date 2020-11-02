import { animate, style, transition, trigger } from '@angular/animations';
import { OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { AddressesService } from '../../addresses.service';

@Component({
  selector: 'app-add-one',
  templateUrl: './add-one.component.html',
  styleUrls: ['./add-one.component.scss'],
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
export class AddOneComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  phoneNumbers: FormArray = new FormArray([]);
  addressAddedSub: Subscription;
  lastSubmittedAddress: Address;
  addressSuccessfullyAdded: boolean = false;
  @ViewChild('form') form;

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
      age: new FormControl(null, Validators.pattern('^[0-9]*$')),
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
      age: this.addressForm.value.age,
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
    this.form.resetForm();
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
