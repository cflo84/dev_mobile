import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  passwordRecoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
  });
  errorMessage: String;
  resetPasswordEmailSent: boolean;

  constructor(private fb: FormBuilder, private auth: AngularFireAuth) {
  }

  ngOnInit() {
    this.resetPasswordEmailSent = false;
  }

  submit() {
    this.errorMessage = null;

    this.auth.sendPasswordResetEmail(this.passwordRecoveryForm.value.email)
      .then(() => {
        this.resetPasswordEmailSent = true;
      })
      .catch(err => {
        switch (err.code) {
            case "auth/invalid-email":
                this.errorMessage = "Email is invalid";
                break;
            case "auth/user-not-found":
                this.errorMessage = "User not found";
                break;
            default:
                this.errorMessage = "An error has occurred";
                break;
        }
      });
  }
  

}
