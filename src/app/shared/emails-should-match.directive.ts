import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";

export const emailsShouldMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const email = control.get('email');
  const confirmEmail = control.get('confirmEmail');

  return email && confirmEmail && email.value !== confirmEmail.value ? {emailsDontMatch: true} : null;
};

@Directive({
  selector: '[appEmailsShouldMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailsShouldMatchValidatorDirective, multi: true }]
})
export class EmailsShouldMatchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return emailsShouldMatchValidator(control);
  }
}