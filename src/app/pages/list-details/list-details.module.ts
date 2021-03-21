import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListDetailsPageRoutingModule } from './list-details-routing.module';

import { ListDetailsPage } from './list-details.page';
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import { EmailNotRedundantValidatorDirective } from '../../shared/email-not-redundant.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ListDetailsPage, CreateTodoComponent, EmailNotRedundantValidatorDirective]
})
export class ListDetailsPageModule {}
