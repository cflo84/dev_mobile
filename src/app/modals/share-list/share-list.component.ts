import {Component, Input, OnInit} from '@angular/core';
import {List} from '../../models/list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ListService} from '../../services/list.service';
import {Todo} from '../../models/todo';

@Component({
  selector: 'app-share-list',
  templateUrl: './share-list.component.html',
  styleUrls: ['./share-list.component.scss'],
})
export class ShareListComponent implements OnInit {
  @Input() list: List;
  private shareForm: FormGroup;


  constructor(private modalController: ModalController,
              private fb: FormBuilder,
              private listService: ListService) {
  }

  ngOnInit() {
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  save() {
    let formValue = this.shareForm.value;
    this.listService.shareList(formValue.email, this.list);
    this.modalController.dismiss();
  }

}
