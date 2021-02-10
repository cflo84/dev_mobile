import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private fb: FormBuilder, private auth: AuthService) {
  }

  ngOnInit() {
    this.errorMessage = null;
    this.resetPasswordEmailSent = false;
  }

  submit() {
    this.errorMessage = null;

    this.auth.resetPassword(this.passwordRecoveryForm.value.email)
      .then(() => this.resetPasswordEmailSent = true)
      .catch(err => this.errorMessage = err);
  }
  

}
