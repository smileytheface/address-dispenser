import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { TextData } from '../shared/models/text-data.model';
import { EmailData } from '../shared/models/email-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/addresses';

@Injectable({
  providedIn: 'root',
})
export class SendAddressesService {
  sharedTextData: TextData;
  sharedEmailData: EmailData;
  private messageSent = new Subject<string>();
  private messageNotSent = new Subject<string>();

  constructor(private http: HttpClient) {}

  textAddresses(textData: TextData) {
    this.http.put(BACKEND_URL + '/text-addresses', textData).subscribe(
      (confirmation) => {
        console.log(confirmation);
        this.messageSent.next('Message sent successfully');
      },
      // Handling possible errors when texting addresses
      (error) => {
        console.error(error);
        // Error for invalid phone number
        if (error.error.error.code === 21211) {
          this.messageNotSent.next('Invalid phone number, message not sent');
        }
        // Error for database issues
        else if (error.source === 'database') {
          this.messageNotSent.next('Internal error, could not assign address');
        }
        // Other errors
        else {
          this.messageNotSent.next(
            'Error occured, addresses may not have been sent'
          );
        }
      }
    );
  }

  emailAddresses(emailData: EmailData) {
    console.log(emailData);
    this.http.put(BACKEND_URL + '/email-addresses', emailData).subscribe(
      (confirmation) => {
        console.log(confirmation);
        this.messageSent.next('Message sent successfully');
      },
      (error) => {
        console.error(error);
        this.messageNotSent.next(
          'Error occured, addresses may not have been sent'
        );
      }
    );
  }

  getMesageSentListener() {
    return this.messageSent.asObservable();
  }

  getMessageNotSentListener() {
    return this.messageNotSent.asObservable();
  }
}
