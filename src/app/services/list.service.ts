import { Injectable } from '@angular/core';
import { List } from '../models/list';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[];

  constructor() {
    this.lists = [];
    this.lists.push(new List("List1"));
    this.lists.push(new List("List2"));
  }

  getOne (id : string): List {
    return this.lists.find((list) => list.id === id);
  }

  getAll() : List[] {
    return this.lists;
  }

  add(list : List) : void {
    this.lists.push(list);
  }
}
