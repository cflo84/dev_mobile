import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";


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

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

  submit() {

  }
}
