export class Todo {
    id: String;
    name: string;
    description: string;
    isDone: boolean;

    constructor(name: string, description: string) {
        this.id = "_" + Math.random.toString().substr(2, 9);
        this.name = name;
        this.description = description;
        this.isDone = false;
    }
}
