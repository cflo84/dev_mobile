import { DocumentData } from "@angular/fire/firestore";

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
    fromFirestore: null
    /*fromFirestore(
        snapshot: QueryDocumentSnapshot<List>,
        options: SnapshotOptions
    ): List {
        const data = snapshot.data(options)!;
        
        return data;
    }*/
};