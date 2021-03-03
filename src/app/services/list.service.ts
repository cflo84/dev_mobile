import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { List, listConverter } from '../models/list';
import {Todo, todoConverter} from "../models/todo";
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly lists: List[];
  private listsCollection: AngularFirestoreCollection<List>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.listsCollection = afs.collection<List>('lists');
    
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

  getOne (id: string): Observable<List> {
    return this.afs.doc("lists/" + id).get().pipe(
      map(snapshot => ({id: snapshot.id, ...snapshot.data() as List} as List))
    );
  }

  getAll(): Observable<List[]> {
    return this.auth.authState.pipe(
      switchMap(user => this.afs.collection("lists", ref => ref.where("owner", "==", user.uid)).snapshotChanges()),
      map(actions => this.convertSnapshotData<List>(actions)),
      tap(val => {console.log(val)})
    );
  }

  async add (list: List): Promise<DocumentReference<List>> {
    list.owner = this.auth.user.uid;

    const listref = await this.listsCollection.ref.withConverter(listConverter).add(list);
    list.id = listref.id;

    return listref;
  }

  update(list: List): Promise<void> {
    return this.listsCollection.doc(list.id).ref.withConverter(listConverter).update(list);
  }

  delete(list: List): Promise<void> {
    // TODO : delete les TODO aussi
    return this.listsCollection.doc(list.id).delete();
  }

  async addTodo (todo: Todo, list: List): Promise<DocumentReference<Todo>> {
    let todoref = null;

    try {
      todoref = await this.listsCollection.doc(list.id).collection<Todo>("todos").add(todo);
      list.todos.push(todo);
      await this.update(list);
      
      todo.id = todoref.id;

      return todoref;
    }
    catch (error) {
      if (todoref != null) {
        //this.todosCollection.doc(todoref.id).delete();
        list.todos.pop();
      }
      return Promise.reject(error);
    }
  }


  deleteTodo(list: List, todo: Todo): void {
    //list.todos.splice(list.todos.indexOf(todo), 1);
  }

  convertSnapshotData<T> (actions: any): List[] {
    return actions.map(action => {
      const id = action.payload.doc.id;
      const data = action.payload.doc.data();
      
      return {id, ...data} as T;
    });
  }
}
