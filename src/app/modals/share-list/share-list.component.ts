import {Component, Input, OnInit} from '@angular/core';
import {List, Sharer} from '../../models/list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ListService} from '../../services/list.service';
import {emailNotRedundantValidator} from '../../shared/email-not-redundant.directive'
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-share-list',
  templateUrl: './share-list.component.html',
  styleUrls: ['./share-list.component.scss'],
})
export class ShareListComponent implements OnInit {
  @Input() list: List;
  shareForm: FormGroup;
  private emails: string[];
  private sharers: Sharer[];
  private isSharersModify: boolean;

  constructor(private modalController: ModalController,
              private fb: FormBuilder,
              private listService: ListService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.emails = [];
    this.sharers = JSON.parse(JSON.stringify(this.list.sharers));
    this.isSharersModify = false;
    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    },{validators: emailNotRedundantValidator(this.sharers)});
  }

  valueMail(){
    return this.shareForm.get('email').value;
  }
  resetForm(){
    this.shareForm.reset({email : ''});
  }

  addEmail() {
    this.emails.push(this.valueMail());
    this.sharers.push({email:this.valueMail(), rights : 'R'});
    this.resetForm();
  }

  removeEmail(sharer: Sharer) {
    const indexEmail = this.emails.indexOf(sharer.email);
    if (indexEmail > -1) {
      this.emails.splice(indexEmail, 1);
    }
    const index = this.sharers.indexOf(sharer);
    if (index > -1) {
      this.sharers.splice(index, 1);
      this.shareForm.reset({email : ''});
    }
    this.isSharersModify = true;
  }

  save() {
    this.listService.shareList(this.sharers,this.list);
    this.modalController.dismiss();
  }

  isDisable() {
    return this.emails.length === 0 && this.isSharersModify === false || (this.shareForm.controls.email.dirty && this.shareForm.controls.email.value.length !== 0);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  writeAccess(sharer: Sharer) {
    if(sharer.rights === 'RW') {
      sharer.rights = 'R';
    }
    else {
      sharer.rights = 'RW';
    }
    this.isSharersModify = true;
  }

  clear() {
    if(this.valueMail() === '') {
      this.resetForm();
    }
  }

  canShare() {
    return this.list.owner === this.auth.user.email;
  }
}
