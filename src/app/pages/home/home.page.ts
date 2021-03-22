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

  constructor(private listService: ListService,
    private listBinService: ListBinService,
    private modalController: ModalController,
    private authService: AuthService,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.lists$ = this.listService.getAll();
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

  onRenderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    this.lists$.pipe(
      map(res => {
        const draggedItem = res.splice(event.detail.from, 1)[0];
        res.splice(event.detail.to, 0, draggedItem);

      })
    );
    event.detail.complete();
  }


  toggleReorderGroup() {
    this.searchInput = "";
    this.isDisabled = !this.isDisabled;
  }

  isSharedWithMe (list: List): boolean {
    return list.owner !== this.authService.user.email;
  }
  isSharedByMe (list: List): boolean {
    return list.owner === this.authService.user.email && list.sharers && list.sharers.length !== 0;
  }
}
