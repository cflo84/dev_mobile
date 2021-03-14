import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Todo, todoConverter } from "./todo";

export class List {
    id: string;
    name: string;
    owner: string;
    todos: Todo[];
    trashed: boolean;

    constructor(name: string) {
        this.name = name;
        this.todos = [];
    }
}


export const listConverter = {
    toFirestore(list: List): DocumentData {
        return {
            name: list.name,
            owner: list.owner,
            trashed: list.trashed || false
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
