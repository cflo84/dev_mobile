import { Component, OnInit } from '@angular/core';
import {IonList, ModalController, PopoverController, ToastController} from '@ionic/angular';
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
import {RenameListComponent} from '../../modals/rename-list/rename-list.component';
import {Router} from '@angular/router';

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
  private countList$: Observable<List[]>;

  constructor(private listService: ListService,
              private listBinService: ListBinService,
              private modalController: ModalController,
              private authService: AuthService,
              private popoverController: PopoverController,
              private orderStorage: ReorderService,
              private toastController: ToastController ) {
  }

  ngOnInit() {
    this.orderStorage.getOrder()
      .then((orderList) => {
        this.lists$ = this.countList$.pipe(
            map(lists => {
              if(orderList && orderList.length !== 0) {
                lists = lists.sort((a, b) => orderList.indexOf(a.id) - orderList.indexOf(b.id));
              }
              this.obj = lists.map(list => list.id);
              this.orderStorage.reorderStorage(this.obj);
              return lists;
            }
        ));
      })
        .catch((err) => console.log(err,"Erreur de récupération de données"));

    this.countList$ = this.listService.getAll();
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

  async toastSuccess(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "bottom",
      buttons: [
          {
            icon: 'close-circle-outline',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
        }
      ]
    });
    return toast.present();
  }

  async toastError() {
    const toast = await this.toastController.create({
      message: "Error, the list has not been deleted",
      duration: 2000,
      color: "danger",
      position: "bottom",
      buttons: [
        {
          icon: 'close-circle-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    return toast.present();
  }

  moveToBin(list: List) {
    const user = this.authService.user.email;
    if(list.owner === user) {
      this.listBinService.moveToBin(list)
          .then(async () => {
            await this.toastSuccess(list.name + " moved to bin");
          })
          .catch(this.toastError);
    } else {
      this.listService.removeSharer(user, list)
          .then(async () => {
            await this.toastSuccess("You've been removed from " + list.name);
          })
          .catch(this.toastError);
    }
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
    const draggedItem = this.obj.splice(event.detail.from, 1)[0];
    this.obj.splice(event.detail.to, 0, draggedItem);
    event.detail.complete();
  }


  toggleReorderGroup() {
    this.searchInput = "";
    if(this.isDisabled === false) {
      this.orderStorage.reorderStorage(this.obj);

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
