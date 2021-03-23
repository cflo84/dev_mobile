import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { List } from 'src/app/models/list';
import { Todo } from 'src/app/models/todo';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-modify-todo',
  templateUrl: './modify-todo.component.html',
  styleUrls: ['./modify-todo.component.scss'],
})
export class ModifyTodoComponent implements OnInit {
  @Input() todo: Todo;
  @Input() list: List;
  todoForm: FormGroup;

  constructor(private modalController: ModalController,
    private fb: FormBuilder,
    private listService: ListService) { }

  ngOnInit() {
    this.todoForm = this.fb.group({
        name: [this.todo.name, [Validators.required, Validators.minLength(3)]],
        description: [this.todo.description]
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  save() {
    this.todo.name = this.todoForm.get("name").value;
    this.todo.description = this.todoForm.get("description").value;
    this.listService.updateTodo(this.list, this.todo);
    this.modalController.dismiss();
  }
}
