import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { List } from '../models/list';
import { Todo } from '../models/todo';
import { AuthService } from './auth.service';
import { ListService } from './list.service';

@Injectable({
  providedIn: 'root'
})
export class ListBinService {
  private binCollection: AngularFirestoreCollection<List>;
  private listCollection: AngularFirestoreCollection<List>;

  constructor(private afs: AngularFirestore,
              private auth: AuthService,
              private listService: ListService) {
    this.binCollection = afs.collection<List>('bin');
    this.listCollection = afs.collection<List>('lists');
  }

  async moveToBin(list: List): Promise<void> {
    list.trashed = true;
    return this.listService.update(list);
  }

  async restoreFromBin(list: List): Promise<void> {
    list.trashed = false;
    return this.listService.update(list);
  }  

  getAll(): Observable<List[]> {
    return this.auth.authState.pipe(
      switchMap(user => this.afs.collection("lists", ref => ref.where("owner", "==", user.email).where("trashed", "==", true)).snapshotChanges()),
      map(actions => this.convertSnapshotData<List>(actions))
    );
  }
  

  private convertSnapshotData<T> (actions: any): T[] {
    return actions.map(action => {
      const id = action.payload.doc.id;
      const data = action.payload.doc.data();
      
      return {id, ...data} as T;
    });
  }
}
