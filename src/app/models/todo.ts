import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";

export class Todo {
    id: string;
    name: string;
    description: string;
    isDone: boolean;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.isDone = false;
    }
}

export const todoConverter = {
    toFirestore(todo: Todo): DocumentData {
        return {
            name: todo.name,
            description: todo.description,
            isDone: todo.isDone
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<Todo>,
        options: SnapshotOptions
    ): Todo {
        const data = snapshot.data(options)!;
        const id = snapshot.id;
      
        return {id, ...data};
    }
};