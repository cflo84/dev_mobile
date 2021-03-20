import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { CreateListComponent } from 'src/app/modals/create-list/create-list.component';
import {ShareListComponent} from '../../modals/share-list/share-list.component';
import { SearchPipeModule } from '../../shared/search-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    SearchPipeModule
  ],
  declarations: [HomePage, CreateListComponent, ShareListComponent]
})
export class HomePageModule {}
