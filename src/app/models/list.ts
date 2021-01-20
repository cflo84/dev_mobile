import { Todo } from "./todo";

export class List {
    name: string;
    todos: Todo[];

    constructor(name: string) {
        this.name = name;
        this.todos = [];
    }
}
