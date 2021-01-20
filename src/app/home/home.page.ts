import { Component } from '@angular/core';
import { List } from '../models/list';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  lists: List[];
  
  constructor(private listService: ListService) {}

  ngOnInit() {
    this.lists = this.listService.getAll();
  }

}
