import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Todo, todoConverter } from "./todo";

export class List {
    id: string;
    name: string;
    owners: string[];
    todos: Todo[];

    constructor(name: string) {
        this.name = name;
        this.todos = [];
    }
}


export const listConverter = {
    toFirestore(list: List): DocumentData {
        return {
            name: list.name,
            owners: list.owners,
            todos: list.todos
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
