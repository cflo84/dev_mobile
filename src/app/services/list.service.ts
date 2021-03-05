import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { List, listConverter } from '../models/list';
import {Todo, todoConverter} from "../models/todo";
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, DocumentReference } from '@angular/fire/firestore';
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
      map(snapshot => {
        const list: List = {id: snapshot.id, ...snapshot.data() as List};
        this.getAllTodos(list).subscribe(todos => list.todos = todos);

        return list;
      })
    );
  }

  getAll(): Observable<List[]> {
    return this.auth.authState.pipe(
      switchMap(user => this.afs.collection("lists", ref => ref.where("owners", "array-contains-any", [user.uid, user.email])).snapshotChanges()),
      map(actions => this.convertSnapshotData<List>(actions)),
      map(actions => actions.map(list => {
        // Assigne les todos
        this.getAllTodos(list).subscribe(todos => list.todos = todos);
        return list;
      }))
    );
  }

  async add (list: List): Promise<DocumentReference<List>> {
    list.owners.push(this.auth.user.uid);

    const listref = await this.listsCollection.ref.withConverter(listConverter).add(list);
    list.id = listref.id;

    return listref;
  }

  update(list: List): Promise<void> {
    return this.listsCollection.doc(list.id).ref.withConverter(listConverter).set(list);
  }

  delete(list: List): Promise<void> {
    return this.listsCollection.doc(list.id).delete();
  }

  





  private getTodoRef(list: List): CollectionReference<Todo> {
    return this.listsCollection.doc(list.id).collection<Todo>("todos").ref.withConverter(todoConverter);
  }

  getAllTodos (list: List): Observable<Todo[]> {
    return this.listsCollection.doc(list.id).collection<Todo>("todos").snapshotChanges().pipe(
      map(actions => this.convertSnapshotData<Todo>(actions))
    );
  }

  async addTodo (list: List, todo: Todo): Promise<DocumentReference<Todo>> {
    const todoref = await this.getTodoRef(list).add(todo);
    todo.id = todoref.id;
    list.todos.push(todo);
    
    return todoref;
  }

  async deleteTodo(list: List, todo: Todo): Promise<void> {
    await this.getTodoRef(list).doc(todo.id).delete();

    // Delete the todo in the list
    list.todos = list.todos.filter(_todo => _todo.id != todo.id);
  }


  updateTodo(list: List, todo: Todo): Promise<void> {
    return this.getTodoRef(list).doc(todo.id).update(todo);
  }



  

  private convertSnapshotData<T> (actions: any): T[] {
    return actions.map(action => {
      const id = action.payload.doc.id;
      const data = action.payload.doc.data();
      
      return {id, ...data} as T;
    });
  }

  shareList(email: string, list: List) {
      //const userEmail = this.auth.user.email;
      list.owners.push(email);
      this.update(list);
  }
}
