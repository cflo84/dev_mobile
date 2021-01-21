import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateListComponent } from 'src/app/modals/create-list/create-list.component';
import { List } from '../../models/list';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lists: List[];
  modalOpened: boolean; // Disable the possibility to open multiple modals

  constructor(private listService: ListService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.lists = this.listService.getAll();
    this.modalOpened = false;
  }

  async presentModal() {
    if (this.modalOpened) return;
    this.modalOpened = true;

    const modal = await this.modalController.create({
      component: CreateListComponent,
      cssClass: 'my-custom-class'
    });

    modal.onDidDismiss().then(() => {
      this.modalOpened = false;
    })
    
    return await modal.present();
  }

  delete(list: List) {
    
  }
}
