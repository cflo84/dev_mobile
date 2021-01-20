export class Todo {
    name: string;
    description: string;
    isDone: boolean;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.isDone = false;
    }
}
