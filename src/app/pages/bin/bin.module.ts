import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BinPageRoutingModule } from './bin-routing.module';

import { BinPage } from './bin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BinPageRoutingModule
  ],
  declarations: [BinPage]
})
export class BinPageModule {}
