import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {List, listConverter, Sharer} from '../models/list';
import {Todo, todoConverter} from '../models/todo';
import {AngularFirestore, AngularFirestoreCollection, CollectionReference, DocumentReference} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {getSharedAnalytics} from '@angular/cli/models/analytics';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  private readonly lists: List[];
  private listsCollection: AngularFirestoreCollection<List>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.listsCollection = afs.collection<List>('lists');
  }

  getOne(id: string): Observable<List> {
    // Retrieve the list, then retrieve the todos, build the object list and return it

    return this.listsCollection.doc(id).snapshotChanges().pipe(
      switchMap(action => this.getAllTodos(id).pipe(
        map(todos => ({id: id, todos: todos, ...action.payload.data()} as List))
      ))
    );
  }

  getAll(): Observable<List[]> {
    return combineLatest(
         this.auth.authState.pipe(
            switchMap(user => this.afs.collection("lists", ref => ref.where("owner", "==", user.email).where("trashed", "==", false)).snapshotChanges()),
            map(actions => this.convertSnapshotData<List>(actions))
        ),
        this.auth.authState.pipe(
            switchMap(user => this.afs.collection("lists", ref => ref.where("sharers", "array-contains-any", [{email: user.email, rights: "RW"}, {email: user.email, rights: "R"}]).where("trashed", "==", false)).snapshotChanges()),
            map(actions => this.convertSnapshotData<List>(actions))
        )).pipe(map((x) =>{
      return x[0].concat(x[1]);
    }));

  }

  async add(list: List): Promise<DocumentReference<List>> {
    list.owner = this.auth.user.email;

    const listref = await this.listsCollection.ref.withConverter(listConverter).add(list);
    list.id = listref.id;
    list.name = list.name.trim();

    return listref;
  }

  update(list: List): Promise<void> {
    return this.listsCollection.doc(list.id).ref.withConverter(listConverter).set(list);
  }

  async delete(list: List): Promise<void> {
    const docList = this.listsCollection.doc(list.id);

    // Delete all the todos in the todos subcollection
    const queryTodos = await docList.collection("todos").ref.get();
    const todoPromises = queryTodos.docs.map(
      doc => doc.ref.delete()
    );
    await Promise.all(todoPromises);

    // Delete the list
    return docList.delete();
  }







  private getTodoRef(list: List): CollectionReference<Todo> {
    return this.listsCollection.doc(list.id).collection<Todo>("todos").ref.withConverter(todoConverter);
  }

  getAllTodos(id: string): Observable<Todo[]> {
    return this.listsCollection.doc(id).collection<Todo>("todos").snapshotChanges().pipe(
      map(actions => this.convertSnapshotData<Todo>(actions))
    );
  }

  async addTodo(list: List, todo: Todo): Promise<DocumentReference<Todo>> {
    const todoref = await this.getTodoRef(list).add(todo);
    todo.id = todoref.id;
    todo.name = todo.name.trim();

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





  private convertSnapshotData<T>(actions: any): T[] {
    return actions.map(action => {
      const id = action.payload.doc.id;
      const data = action.payload.doc.data();

      return { id, ...data } as T;
    });
  }

  async shareList(sharers: Sharer[], list: List): Promise<void> {
    list.sharers = sharers;
    return await this.update(list);
  }

  async removeSharer(email: string, list: List): Promise<void> {
    const index = list.sharers.findIndex(sharer => sharer.email === email);
    if (index !== -1) {
      list.sharers = list.sharers.splice(index, 0);
      return await this.update(list);
    }
  }
}
