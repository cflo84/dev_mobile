import {Component, OnInit} from '@angular/core';
import {ListService} from "../../services/list.service";
import {ActivatedRoute} from "@angular/router";
import {List} from "../../models/list";
import {Todo} from "../../models/todo";
import {ModalController} from "@ionic/angular";
import {CreateTodoComponent} from "../../modals/create-todo/create-todo.component";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.page.html',
    styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
    listId: string;
    list$: Observable<List>;
    modalOpened: boolean; // Disable the possibility to open multiple modals

    constructor(private listService: ListService,
                private modalController: ModalController,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.listId = this.route.snapshot.paramMap.get('id');
        this.list$ = this.listService.getOne(this.listId);
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

    delete(list: List, todo: Todo) {
        this.listService.deleteTodo(list, todo);
    }

    toggleIsDone (todo: Todo) {
        todo.isDone = !todo.isDone;
    }
}
