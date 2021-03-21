import {Component, OnInit} from '@angular/core';
import {ListService} from "../../services/list.service";
import {ActivatedRoute, Router} from '@angular/router';
import {List} from "../../models/list";
import {Todo} from "../../models/todo";
import {ModalController} from "@ionic/angular";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import { Observable } from 'rxjs';
import {ShareListComponent} from '../../modals/share-list/share-list.component';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.page.html',
    styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
    listId: string;
    list$: Observable<List>;
    access: string;
    modalOpened: boolean; // Disable the possibility to open multiple modals

    constructor(private listService: ListService,
                private modalController: ModalController,
                private route: ActivatedRoute,
                private auth: AuthService,
                private router: Router) {
    }

    ngOnInit() {
        this.listId = this.route.snapshot.paramMap.get('id');
        this.list$ = this.listService.getOne(this.listId);
        this.list$.subscribe(l => {
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
                    this.router.navigate(['/']);
                }
            }
        });
        this.modalOpened = false;
    }

    async presentModal(list: List) {
        if (this.modalOpened) return;
        this.modalOpened = true;

        const modal = await this.modalController.create({
            component: CreateTodoComponent,
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
}
