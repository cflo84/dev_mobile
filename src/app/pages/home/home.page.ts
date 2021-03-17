import {Component, OnInit} from '@angular/core';
import {IonReorderGroup, ModalController} from '@ionic/angular';
import { Observable } from 'rxjs';
import { CreateListComponent } from 'src/app/modals/create-list/create-list.component';
import { List } from '../../models/list';
import { ListService } from '../../services/list.service';
import {ShareListComponent} from '../../modals/share-list/share-list.component';
import {map} from 'rxjs/operators';
import { ListBinService } from '../../services/list-bin.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  lists$: Observable<List[]>;
  lists_search$: Observable<List[]>;
  modalOpened: boolean; // Disable the possibility to open multiple modals
  isDisabled: boolean;

  constructor(private listService: ListService,
              private listBinService: ListBinService,
              private modalController: ModalController) { }

  ngOnInit() {
    this.lists$ = this.listService.getAll();
    this.lists_search$ = this.lists$;
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

  moveToBin(list: List) {
    this.listBinService.moveToBin(list);
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

  search (event: any) {
    const text = event.detail.value.toLocaleLowerCase();

    this.lists_search$ = this.lists$.pipe(
      map(lists => lists.filter(
        list => list.name.toLocaleLowerCase().includes(text)
      ))
    )
  }

}
