import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { List } from 'src/app/models/list';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-rename-list',
  templateUrl: './rename-list.component.html',
  styleUrls: ['./rename-list.component.scss'],
})
export class RenameListComponent implements OnInit {
  @Input() list: List;
  listForm: FormGroup;

  constructor(private modalController: ModalController,
    private fb: FormBuilder,
    private listService: ListService) { }

  ngOnInit() {
    this.listForm = this.fb.group({
      name: [this.list.name, [Validators.required, Validators.minLength(3)]]
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  save() {
    this.list.name = this.listForm.get("name").value;
    this.listService.update(this.list);
    this.modalController.dismiss();
  }
}
