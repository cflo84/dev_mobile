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
  }

  getOne (id : string): List {
    for (let list of this.lists) {
      if (list.name == id) {
        return list;
      }
    }
    
    return null;
  }

  getAll() : List[] {
    return this.lists;
  }

  create(l : List) : void {
    this.lists.push(l);
  }
}
