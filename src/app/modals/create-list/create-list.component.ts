import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { List } from 'src/app/models/list';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  listForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private modalController: ModalController,
    private fb: FormBuilder,
    private listService: ListService) { }

  ngOnInit() { }

  dismissModal() {
    this.modalController.dismiss();
  }

  save() {
    this.listService.add(new List(this.listForm.get("name").value));
    this.modalController.dismiss();
  }
}
