import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from '../shared/models/address.model';
import { TextData } from '../shared/models/text-data.model';

@Injectable({
  providedIn: 'root',
})
export class SendAddressesService {
  constructor(private http: HttpClient) {}

  textAddresses(textData: TextData) {
    console.log(textData);
    this.http
      .put('http://localhost:3000/api/addresses/text-addresses', textData)
      .subscribe(
        (confirmation) => {
          console.log(confirmation);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
