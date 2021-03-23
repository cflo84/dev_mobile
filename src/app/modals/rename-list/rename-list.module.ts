import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RenameListComponent } from "./rename-list.component";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      ReactiveFormsModule,
    ],
    declarations: [RenameListComponent],
    exports: [RenameListComponent]
  })
  export class RenameListModule {}
  