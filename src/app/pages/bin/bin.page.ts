import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { List } from '../../models/list';
import { ListBinService } from '../../services/list-bin.service';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.page.html',
  styleUrls: ['./bin.page.scss'],
})
export class BinPage implements OnInit {
  trashedLists$: Observable<List[]>;

  constructor(
    private listBinService: ListBinService,
    private listService: ListService) { }

  ngOnInit() {
    this.trashedLists$ = this.listBinService.getAll();
  }

  restoreFromBin(list: List) {
    this.listBinService.restoreFromBin(list);
  }

  delete(list: List) {
    this.listService.delete(list);
  }

}
