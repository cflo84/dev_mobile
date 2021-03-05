import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Todo, todoConverter } from "./todo";

export class List {
    id: string;
    name: string;
    owners: string[];
    todos: Todo[];

    constructor(name: string) {
        this.name = name;
        this.owners = [];
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
    fromFirestore(
        snapshot: QueryDocumentSnapshot<List>,
        options: SnapshotOptions
    ): List {
        const data = snapshot.data(options)!;
        const id = snapshot.id;

        return {id, ...data};
    }
};
