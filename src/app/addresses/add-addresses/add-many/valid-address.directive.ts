import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appValidAddress]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ValidAddressDirective, multi: true },
  ],
})
export class ValidAddressDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      let splitAddressStrings: string[] = control.value.split(/\r\n|\r|\n/g);
      for (let addressString of splitAddressStrings) {
        let addressInfoArray = addressString.split(',');
        if (addressInfoArray.length < 5) {
          return { incompleteAddress: true };
        }
      }
    }

    return null;
  }
}
