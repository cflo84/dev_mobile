import {Component, OnInit} from '@angular/core';
import {ListService} from "../../services/list.service";
import {ActivatedRoute, Router} from '@angular/router';
import {List} from "../../models/list";
import {Todo} from "../../models/todo";
import {IonList, ModalController, ToastController} from "@ionic/angular";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import {Observable, Subject} from 'rxjs';
import {ShareListComponent} from '../../modals/share-list/share-list.component';
import {AuthService} from '../../services/auth.service';
import {tap} from 'rxjs/operators';
import { RenameListComponent } from 'src/app/modals/rename-list/rename-list.component';
import { ListBinService } from 'src/app/services/list-bin.service';
import { ModifyTodoComponent } from 'src/app/modals/modify-todo/modify-todo.component';

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.page.html',
    styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
    listId: string;
    list$: Observable<List>;
    unsubscribe$: Subject<any>;
    access: string;
    shareModale: HTMLIonModalElement;
    todoModale: HTMLIonModalElement;
    modalOpened: boolean; // Disable the possibility to open multiple modals

    constructor(private listService: ListService,
                private listBinService: ListBinService,
                private modalController: ModalController,
                private route: ActivatedRoute,
                private auth: AuthService,
                private router: Router,
                private toastController: ToastController) {
    }

    ngOnInit() {
        this.listId = this.route.snapshot.paramMap.get('id');
        this.list$ = this.listService.getOne(this.listId).pipe(
            tap(l => {
                const email = this.auth.user.email;
                if(l.owner === email){
                    this.access = 'RW';
                }
                else {
                    let stillSharer = false;
                    l.sharers.forEach(s => {
                        if(s.email === email) {
                            this.access = s.rights;
                            stillSharer = true;
                        }
                    });
                    if(!stillSharer) {
                        if(this.shareModale !== null) this.shareModale.dismiss();
                        if(this.todoModale != null) this.todoModale.dismiss();
                        this.router.navigate(['/']);
                    }
                }
            })
        );
        this.modalOpened = false;

        this.access = 'RW';
    }

    async presentModal(list: List) {
        if (this.modalOpened) return;
        this.modalOpened = true;

        this.todoModale = await this.modalController.create({
            component: CreateTodoComponent,
            cssClass: 'my-custom-class',
            componentProps: {
                list: list
            }
        });

        this.todoModale.onDidDismiss().then(() => {
            this.modalOpened = false;
            this.todoModale = null;
        })

        return await this.todoModale.present();
    }

    async presentShareModal(list: List) {
        if (this.modalOpened) return;
        this.modalOpened = true;

        this.shareModale = await this.modalController.create({
            component: ShareListComponent,
            componentProps: {
                list: list
            }
        });

        this.shareModale.onDidDismiss().then(() => {
            this.modalOpened = false;
            this.shareModale = null;
        })

        return await this.shareModale.present();
    }

    
  async rename(list: List) {
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
    })

    return await modal.present();
  }

    delete(list: List, todo: Todo) {
        this.listService.deleteTodo(list, todo);
    }

    toggleIsDone (list: List, todo: Todo) {
        todo.isDone = !todo.isDone;
        this.listService.updateTodo(list, todo);
    }

    canWrite() {
        return this.access === 'RW';
    }

    moveToBin(list: List) {
      this.listBinService.moveToBin(list)
        .then(() => this.router.navigate(['/']))
        .catch(async () => {
            const toast = await this.toastController.create({
                message: "Error, the list has not been deleted",
                duration: 2000,
                color: "danger",
                position: "top"
            });
            toast.present();
        });
    }

    async modifyTodo(todo: Todo, list: List, todosHtmlElement: IonList) {
        if (this.modalOpened) return;
        this.modalOpened = true;
    
        const modal = await this.modalController.create({
          component: ModifyTodoComponent,
          cssClass: 'my-custom-class',
          componentProps: {
            todo: todo,
            list: list
          }
        });
    
        modal.onDidDismiss().then(() => {
          this.modalOpened = false;
          todosHtmlElement.closeSlidingItems();
        })
    
        return await modal.present();
      }
}
