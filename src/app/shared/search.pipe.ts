import { Pipe, PipeTransform } from '@angular/core';
import { List } from '../models/list';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(lists: List[], input?: string): List[] {
    if (!input) return lists;

    return lists.filter(list => list.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()));
  }

}
