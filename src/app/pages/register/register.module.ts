import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import {EmailsShouldMatchValidatorDirective} from "src/app/shared/emails-should-match.directive";
import { passwordsShouldMatchValidatorDirective } from 'src/app/shared/passwords-should-match.directive';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegisterPageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ],
  declarations: [RegisterPage, EmailsShouldMatchValidatorDirective, passwordsShouldMatchValidatorDirective]
})
export class RegisterPageModule {}
