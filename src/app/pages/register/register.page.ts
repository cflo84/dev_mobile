import {Component, OnInit} from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    ValidatorFn,
    Validators,
    AbstractControl,
    ValidationErrors
} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {emailsShouldMatchValidator} from "src/app/shared/emails-should-match.directive";
import {passwordsShouldMatchValidator} from "src/app/shared/passwords-should-match.directive";

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
    }, {validators: [emailsShouldMatchValidator, passwordsShouldMatchValidator]});

    errorMessage: String;
    verificationEmailSent: boolean;

    constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router) {
    }

    ngOnInit() {
        this.errorMessage = null;
        this.verificationEmailSent = false;
    }

    submit() {
        this.errorMessage = null;

        let formValue = this.registerForm.value;
        this.auth.createUserWithEmailAndPassword(formValue.email, formValue.password)
            .then(
                user => { // Creation succeeded
                    user.user.sendEmailVerification(null)
                        .then(() => {
                            // Verification email sent
                            // Sign out and tell the user to verify their email
                            this.auth.signOut().then(() =>
                                this.verificationEmailSent = true);
                        })
                        .catch(error => {
                            // Error occurred. Inspect error code.
                            console.log(error);
                        });
                },
                err => { // Creation failed
                    switch (err.code) {
                        case "auth/invalid-email":
                            this.errorMessage = "Email is invalid";
                            break;
                        case "auth/email-already-in-use":
                            this.errorMessage = "There is already a user for this email";
                            break;
                        case "auth/weak-password":
                            this.errorMessage = "Password is too weak";
                            break;
                    }
                });
    }
}
