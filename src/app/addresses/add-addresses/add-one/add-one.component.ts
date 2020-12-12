import { animate, style, transition, trigger } from '@angular/animations';
import { OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { Writer } from 'src/app/shared/models/writer.model';
import { WritersService } from 'src/app/writers/writers.service';
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
  addressEditedSub: Subscription;
  lastSubmittedAddress: Address;
  addressSuccessfullyAdded: boolean = false;
  @ViewChild('form') form;
  editMode = false;
  addressId: string;
  writers: Writer[] = [];
  writersSub: Subscription;

  constructor(
    private addressesService: AddressesService,
    public route: ActivatedRoute,
    public router: Router,
    private writersService: WritersService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.writersService.getWriters();
    this.writersSub = this.writersService
      .getWritersUpdatedListener()
      .subscribe((writers) => {
        this.writers = writers;
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('addressId')) {
        this.editMode = true;
        this.addressId = paramMap.get('addressId');
        this.addressesService
          .getAddress(this.addressId)
          .subscribe((address) => {
            for (let phoneNum of address.phone) {
              this.addPhone(phoneNum);
            }

            console.log(this.writers);

            this.addressForm.patchValue({
              name: address.name,
              age: address.age ? address.age : null,
              street: address.street,
              city: address.city,
              state: address.state,
              zip: address.zip,
              writer: address.writer,
              phone: address.phone,
            });
          });
      }
    });

    this.addressAddedSub = this.addressesService
      .getAddressAddedListener()
      .subscribe((address) => {
        if (address === this.lastSubmittedAddress) {
          this.showAddressAddedMessage();
        } else {
          return;
        }
      });

    this.addressEditedSub = this.addressesService
      .getAddressEditedListener()
      .subscribe((id: string) => {
        if (id === this.lastSubmittedAddress.id) {
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
      writer: new FormControl(null),
      phone: this.phoneNumbers,
    });
  }

  get phoneControls() {
    return (<FormArray>this.addressForm.get('phone')).controls;
  }

  onAddPhoneNumber() {
    (<FormArray>this.addressForm.get('phone')).push(new FormControl());
  }

  addPhone(phoneNum: string) {
    (<FormArray>this.addressForm.get('phone')).push(new FormControl(phoneNum));
  }

  onRemovePhone(index: number) {
    (<FormArray>this.addressForm.get('phone')).removeAt(index);
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      return;
    }
    console.log(this.addressForm.value.writer);

    const newAddress: Address = {
      id: this.editMode ? this.addressId : null,
      name: this.addressForm.value.name,
      age: this.addressForm.value.age,
      street: this.addressForm.value.street,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      zip: this.addressForm.value.zip,
      phone: this.addressForm.value.phone,
      assigned: this.addressForm.value.writer ? true : false,
      writer: this.addressForm.value.writer
        ? this.addressForm.value.writer
        : null,
    };

    if (this.editMode) {
      this.addressesService.updateAddress(this.addressId, newAddress);
    } else {
      this.addressesService.addAddress(newAddress);
      this.form.resetForm();
    }

    console.log(newAddress);

    this.lastSubmittedAddress = newAddress;
  }

  onCancel() {
    this.router.navigate(['/available-addresses']);
  }

  showAddressAddedMessage() {
    this.addressSuccessfullyAdded = true;
    setTimeout(() => {
      this.addressSuccessfullyAdded = false;
    }, 4000);
  }

  ngOnDestroy() {
    this.addressAddedSub.unsubscribe();
    this.writersSub.unsubscribe();
  }
}
