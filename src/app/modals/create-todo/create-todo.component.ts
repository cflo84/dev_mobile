import {Component, Input, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {ListService} from "../../services/list.service";
import {List} from "../../models/list";
import {Todo} from "../../models/todo";

@Component({
    selector: 'app-create-todo',
    templateUrl: './create-todo.component.html',
    styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
    @Input() list: List;
    todoForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: ''
    });

    constructor(private modalController: ModalController,
                private fb: FormBuilder,
                private listService: ListService) {
    }

    ngOnInit() {
    }

    dismissModal() {
        this.modalController.dismiss();
    }

    save() {
        let formValue = this.todoForm.value;
        this.listService.addTodo(this.list, new Todo(formValue.name, formValue.description));
        this.modalController.dismiss();
    }
}
