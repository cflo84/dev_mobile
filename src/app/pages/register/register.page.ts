import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    ValidatorFn,
    Validators,
    AbstractControl,
    ValidationErrors
} from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { emailsShouldMatchValidator } from "src/app/shared/emails-should-match.directive";
import { passwordsShouldMatchValidator } from "src/app/shared/passwords-should-match.directive";
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: [emailsShouldMatchValidator, passwordsShouldMatchValidator] });

    errorMessage: String;
    verificationEmailSent: boolean;

    constructor(private fb: FormBuilder, public auth: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.errorMessage = null;
        this.verificationEmailSent = false;
    }

    submit() {
        this.errorMessage = null;
        let formValue = this.registerForm.value;

        this.auth.register(formValue.email, formValue.password)
            .then(() => this.verificationEmailSent = true) // Tell the user to verify their email
            .catch(err => this.errorMessage = err);
    }
}
