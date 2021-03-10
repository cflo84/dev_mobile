import {Component, OnInit, ViewChild} from '@angular/core';
import {IonReorderGroup, ModalController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateListComponent } from 'src/app/modals/create-list/create-list.component';
import { List } from '../../models/list';
import { ListService } from '../../services/list.service';
import {ShareListComponent} from '../../modals/share-list/share-list.component';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  lists$: Observable<List[]>;
  modalOpened: boolean; // Disable the possibility to open multiple modals
  private isDisabled: boolean;

  constructor(private listService: ListService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.lists$ = this.listService.getAll();
    this.modalOpened = false;
    this.isDisabled = true;
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

  async presentShareModal(list: List) {
    if (this.modalOpened) return;
    this.modalOpened = true;

    const modal = await this.modalController.create({
      component: ShareListComponent,
      componentProps: {
        list: list
      }
    });

    modal.onDidDismiss().then(() => {
      this.modalOpened = false;
    })

    return await modal.present();
  }

  delete(list: List) {
    this.listService.delete(list);
  }

  onRenderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    this.lists$.pipe(
        map(res => {
          const draggedItem = res.splice(event.detail.from,1)[0];
          res.splice(event.detail.to,0,draggedItem);

        })
    );
    event.detail.complete();
  }


  toggleReorderGroup() {
    this.isDisabled = !this.isDisabled;
  }

}
