import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ModifyTodoComponent } from "./modify-todo.component";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      ReactiveFormsModule,
    ],
    declarations: [ModifyTodoComponent],
    exports: [ModifyTodoComponent]
  })
  export class ModifyTodoModule {}
  