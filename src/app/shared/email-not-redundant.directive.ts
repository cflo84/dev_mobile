import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Sharer} from '../models/list';

@Directive({
  selector: '[appEmailsExisting]',
  providers: [{provide: NG_VALIDATORS, useExisting: EmailNotRedundantValidatorDirective, multi: true}]
})
export class EmailNotRedundantValidatorDirective implements Validator {
  @Input('appEmailsExisting') sharers: Sharer[];

  validate(control: AbstractControl): ValidationErrors | null {
    return emailNotRedundantValidator(this.sharers);
  }
}

export function emailNotRedundantValidator(sharers: Sharer[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const newEmail = control.get('email')?.value;
    let exist = false;
    sharers.forEach(s => {
      if (s.email === newEmail) {
        exist = true;
      }
    })
    console.log("exist ? : "+exist);
    return exist ? {alreadyExist: true} : null;
  };
}

