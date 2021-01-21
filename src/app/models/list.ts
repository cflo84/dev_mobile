import { Todo } from "./todo";

export class List {
    id: string;
    name: string;
    todos: Todo[];

    constructor(name: string) {
        this.id = "_" + Math.random().toString().substr(2, 9);
        this.name = name;
        this.todos = [];
    }
}
