import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Address } from '../shared/models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private addresses: Address[] = [];
  private addressesUpdated = new Subject<Address[]>();
  private addressAdded = new Subject<Address>();
  private addressesAdded = new Subject<Address[]>();

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

  addAddress(address: Address) {
    const newAddress = address;
    this.http
      .post<{ message: string; addressId: string }>(
        'http://localhost:3000/api/addresses',
        newAddress
      )
      .subscribe((responseData) => {
        const id = responseData.addressId;
        newAddress.id = id;
        this.addresses.push(newAddress);
        this.addressesUpdated.next([...this.addresses]);
        this.addressAdded.next(newAddress);
      });
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

  getAddressesUpdatedListener() {
    return this.addressesUpdated.asObservable();
  }

  getAddressAddedListener() {
    return this.addressAdded.asObservable();
  }
}
