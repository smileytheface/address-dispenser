import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from '../shared/models/address.model';
import { TextData } from '../shared/models/text-data.model';
import { EmailData } from '../shared/models/email-data.model';

@Injectable({
  providedIn: 'root',
})
export class SendAddressesService {
  sharedTextData: TextData;
  sharedEmailData: EmailData;

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

  emailAddresses(emailData: EmailData) {
    console.log(emailData);
    this.http
      .put('http://localhost:3000/api/addresses/email-addresses', emailData)
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
