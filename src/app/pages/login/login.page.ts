import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';


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

    constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    }

    ngOnInit() {
        this.errorMessage = null;
    }

    submit() {
        this.errorMessage = null;

        let formValue = this.loginForm.value;
        this.auth.login(formValue.email, formValue.password)
            .then(() => {
                this.router.navigateByUrl('/', { replaceUrl: true });
            })
            .catch(err => this.errorMessage = err);
    }
}
