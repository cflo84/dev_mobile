import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";

export const passwordsShouldMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value ? {passwordsDontMatch: true} : null;
};

@Directive({
  selector: '[appPasswordsShouldMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: passwordsShouldMatchValidatorDirective, multi: true }]
})
export class passwordsShouldMatchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return passwordsShouldMatchValidator(control);
  }
}