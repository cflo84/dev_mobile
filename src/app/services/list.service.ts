import { Injectable } from '@angular/core';
import { List } from '../models/list';
import {Todo} from "../models/todo";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly lists: List[];

  constructor() {
    this.lists = [];
    this.lists.push(new List("List1"));
    this.lists.push(new List("List2"));
    this.lists[0].todos.push(new Todo("I'm a todo !", "Some description."));
    this.lists[0].todos.push(new Todo("AnotherOne", ""));
    this.lists[0].todos[1].isDone = true;
    this.lists[0].todos.push(new Todo("Hello",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
        "Vivamus tempor mi sed enim ullamcorper congue. " +
        "Phasellus vitae metus rutrum, finibus eros vitae,cursus nunc. "));
    this.lists[0].todos.push(new Todo("AnotherOne", "another one !"));
  }

  getOne (id: string): List {
    return this.lists.find(list => list.id === id);
  }

  getAll(): List[] {
    return this.lists;
  }

  add(list: List): void {
    this.lists.push(list);
  }

  addTodo (todo: Todo, list: List): void {
    list.todos.push(todo);
  }

  delete(list: List): void {
    this.lists.splice(this.lists.indexOf(list), 1);
  }

  deleteTodo(list: List, todo: Todo): void {
    list.todos.splice(list.todos.indexOf(todo), 1);
  }
}
