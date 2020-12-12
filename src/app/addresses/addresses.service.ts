import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Address } from '../shared/models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private addresses: Address[] = [];
  private assignedAddresses: Address[] = [];
  private addressesUpdated = new Subject<Address[]>();
  private assignedAddressesUpdated = new Subject<Address[]>();
  private addressAdded = new Subject<Address>();
  private addressesAdded = new Subject<Address[]>();
  private addressEdited = new Subject<string>();

  constructor(private http: HttpClient) {}

  getAddresses() {
    this.http
      .get<{ message: string; addresses: any }>(
        'http://localhost:3000/api/addresses'
      )
      .pipe(
        map((addressData) => {
          return addressData.addresses.map((address) => {
            return {
              id: address._id,
              name: address.name,
              age: address.age,
              street: address.street,
              city: address.city,
              state: address.state,
              zip: address.zip,
              phone: address.phone,
              assigned: address.assigned,
              writer: address.writer,
            };
          });
        })
      )
      .subscribe((transformedAddresses) => {
        this.addresses = transformedAddresses;
        this.addressesUpdated.next([...this.addresses]);
      });
  }

  getAddress(addressId: string) {
    return this.http.get<any>(
      'http://localhost:3000/api/addresses/' + addressId
    );
  }

  getAssignedAddresses() {
    this.http
      .get<{ assignedAddresses: any }>(
        'http://localhost:3000/api/addresses/assigned'
      )
      .pipe(
        map((assignedAddressData) => {
          return assignedAddressData.assignedAddresses.map((address) => {
            return {
              id: address._id,
              name: address.name,
              age: address.age,
              street: address.street,
              city: address.city,
              state: address.state,
              zip: address.zip,
              phone: address.phone,
              assigned: address.assigned,
              writer: address.writer,
            };
          });
        })
      )
      .subscribe((transformedAddresses) => {
        this.assignedAddresses = transformedAddresses;
        this.assignedAddressesUpdated.next([...this.assignedAddresses]);
      });
  }

  addAddress(address: Address) {
    const newAddress = address;
    this.http
      .post<{ message: string; addressId: string }>(
        'http://localhost:3000/api/addresses',
        newAddress
      )
      .subscribe(
        (responseData) => {
          const id = responseData.addressId;
          newAddress.id = id;
          this.addresses.push(newAddress);
          this.addressesUpdated.next([...this.addresses]);
          this.addressAdded.next(newAddress);
        },
        (error) => {
          console.error(error.data.message);
        }
      );
  }

  addAddresses(addresses: Address[]) {
    console.log('fired!');
    let newAddresses: Address[] = addresses;
    this.http
      .post<any>('http://localhost:3000/api/addresses/add-many', newAddresses)
      .subscribe((responseData) => {
        const ids: string[] = responseData.addressIDs;
        for (let i = 0; i < newAddresses.length; i++) {
          newAddresses[i].id = ids[i];
          this.addresses.push(newAddresses[i]);
        }
        this.addressesUpdated.next([...this.addresses]);
        this.addressesAdded.next(newAddresses);
      });
  }

  deleteAddress(address: Address) {
    this.http
      .delete<{ message: string }>(
        'http://localhost:3000/api/addresses/' + address.id
      )
      .subscribe(() => {
        const updatedAddresses = this.addresses.filter(
          (add) => add.id !== address.id
        );
        this.addresses = updatedAddresses;
        this.addressesUpdated.next([...this.addresses]);

        if (address.assigned) {
          const assignedAddresses = this.addresses.filter(
            (address) => address.assigned
          );
          this.assignedAddresses = assignedAddresses;
          this.assignedAddressesUpdated.next([...this.assignedAddresses]);
        }
      });
  }

  filterTest() {
    console.log(this.addresses);
    // console.log(this.addresses[0].assigned);
    // console.log(this.addresses.filter((address) => address.assigned));
  }

  updateAddress(id: string, updatedAddress: Address) {
    const newAddress = updatedAddress;
    console.log(newAddress);
    this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/addresses/' + id,
        newAddress
      )
      .subscribe((responseMessage) => {
        const updatedAddresses = [...this.addresses];
        const oldAddressIndex = updatedAddresses.findIndex(
          (address) => address.id === newAddress.id
        );
        updatedAddresses[oldAddressIndex] = newAddress;
        this.addresses = updatedAddresses;
        this.addressesUpdated.next([...this.addresses]);
        this.addressEdited.next(newAddress.id);
      });
  }

  getAssignedAddressesUpdatedListener() {
    return this.assignedAddressesUpdated.asObservable();
  }

  getAddressesUpdatedListener() {
    return this.addressesUpdated.asObservable();
  }

  getAddressAddedListener() {
    return this.addressAdded.asObservable();
  }

  getAddressesAddedListener() {
    return this.addressesAdded.asObservable();
  }

  getAddressEditedListener() {
    return this.addressEdited.asObservable();
  }
}
