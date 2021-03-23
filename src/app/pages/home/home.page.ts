import { Component, OnInit } from '@angular/core';
import { IonReorderGroup, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateListComponent } from 'src/app/modals/create-list/create-list.component';
import { List } from '../../models/list';
import { ListService } from '../../services/list.service';
import { ShareListComponent } from '../../modals/share-list/share-list.component';
import { map } from 'rxjs/operators';
import { ListBinService } from '../../services/list-bin.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuComponent } from 'src/app/modals/menu/menu/menu.component';
import {ReorderService} from '../../services/reorder.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  lists$: Observable<List[]>;
  searchInput: any;
  modalOpened: boolean; // Disable the possibility to open multiple modals
  isDisabled: boolean;
  obj: string[];

  constructor(private listService: ListService,
    private listBinService: ListBinService,
    private modalController: ModalController,
    private authService: AuthService,
    private popoverController: PopoverController,
    private orderStorage: ReorderService ) {
  }

  ngOnInit() {
    this.orderStorage.getOrder()
      .then((orderList) => {
        this.lists$ = this.listService.getAll().pipe(
            map(lists => {
              if(orderList && orderList.length !== 0) {
                lists = lists.sort((a, b) => orderList.indexOf(a.id) - orderList.indexOf(b.id));
              }
              this.obj = lists.map(list => list.id);
              this.orderStorage.reorderStorage(this.obj).then(() => {console.log("this.obj : "+this.obj)});

              return lists;
            }
        ));
      })
        .catch((err) => console.log(err,"Erreur de récupération de données"));

    this.modalOpened = false;
    this.isDisabled = true;
  }

  async presentPopoverMenu(ev: any) {
    const menuPopover = await this.popoverController.create({
      component: MenuComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });

    menuPopover.onDidDismiss().then(eventDetails => {
      if (eventDetails.data && eventDetails.data.reorder === true) {
        this.toggleReorderGroup();
      }
    });

    return await menuPopover.present();
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

  moveToBin(list: List) {
    this.listBinService.moveToBin(list);
  }

  async rename(list: List, listsHtmlElement: IonList) {
    if (this.modalOpened) return;
    this.modalOpened = true;

    const modal = await this.modalController.create({
      component: RenameListComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        list: list
      }
    });

    modal.onDidDismiss().then(() => {
      this.modalOpened = false;
      listsHtmlElement.closeSlidingItems();
    })

    return await modal.present();
  }

  onRenderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    const draggedItem = this.obj.splice(event.detail.from, 1)[0];
    this.obj.splice(event.detail.to, 0, draggedItem);
    event.detail.complete();
  }


  toggleReorderGroup() {
    this.searchInput = "";
    if(this.isDisabled === false) {
      console.log(this.orderStorage.getOrder());
      this.orderStorage.reorderStorage(this.obj);
      console.log(this.orderStorage.getOrder());

      this.isDisabled = true;
    }
    else { this.isDisabled = false; }
  }

  isSharedWithMe (list: List): boolean {
    return list.owner !== this.authService.user.email;
  }
  isSharedByMe (list: List): boolean {
    return list.owner === this.authService.user.email && list.sharers && list.sharers.length !== 0;
  }
}
