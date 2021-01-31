import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
    errorMessage: String;

    constructor(private fb: FormBuilder, public auth: AngularFireAuth, private router: Router) {
    }

    ngOnInit() {
        this.errorMessage = null;
    }

    submit() {
        this.errorMessage = null;

        let formValue = this.loginForm.value;
        this.auth.signInWithEmailAndPassword(formValue.email, formValue.password)
            .then(
                user => {
                    this.router.navigateByUrl('/home', { replaceUrl: true });
                },
                err => {
                    switch (err.code) {
                        case "auth/invalid-email":
                            this.errorMessage = "Email is invalid";
                            break;
                        case "auth/user-disabled":
                            this.errorMessage = "User is disabled";
                            break;
                        case "auth/user-not-found":
                            this.errorMessage = "User not found";
                            break;
                        case "auth/wrong-password":
                            this.errorMessage = "Wrong password";
                            break;
                    }
                });
    }
}
