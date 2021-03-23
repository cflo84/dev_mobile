import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "@angular/fire/firestore";
import { Todo } from "./todo";

export type Sharer = {
    email: string;
    rights: 'R' | 'RW' ;
};

export class List {
    id: string;
    name: string;
    owner: string;
    sharers: Sharer[];
    todos: Todo[];
    trashed: boolean;

    constructor(name: string) {
        this.name = name;
        this.todos = [];
        this.sharers = [];
    }
}


export const listConverter = {
    toFirestore(list: List): DocumentData {
        return {
            name: list.name,
            owner: list.owner,
            sharers: list.sharers,
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
