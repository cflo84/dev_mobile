import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private popoverController: PopoverController,
              private authService: AuthService) { }

  ngOnInit() {}

  dismissPopover() {
    this.popoverController.dismiss({reorder: false});
  }

  dismissPopoverWithReorder() {
    this.popoverController.dismiss({reorder: true});
  }
  
  logOut() {
    this.authService.logOut();
  }
}
