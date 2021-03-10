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
  shareForm: FormGroup;
  private emails: string[];


  constructor(private modalController: ModalController,
              private fb: FormBuilder,
              private listService: ListService) {
  }

  ngOnInit() {
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.emails = [];
  }

  addEmail() {
    this.emails.push(this.shareForm.get('email').value);
    this.shareForm.reset();
  }

  removeEmail(email: string) {
    const index = this.emails.indexOf(email);
    if (index > -1) {
      this.emails.splice(index, 1);
    }
    this.shareForm.reset();
  }

  save() {
    this.listService.shareList(this.emails, this.list);
    this.modalController.dismiss();
  }

  isDisable() {
    return this.emails.length === 0 || (this.shareForm.controls.email.dirty && this.shareForm.controls.email.value.length !== 0);
  }
}
