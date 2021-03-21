import { Directive, HostListener } from '@angular/core';
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';
import { NavController } from '@ionic/angular';


@Directive({
  selector: '[backButton]'
})
export class BackButtonDirective {

  constructor(private navController: NavController) { }

  @HostListener('click')
  onClick(): void {
    this.goBack();
  }

  goBack() {
    let animations: AnimationOptions = {
        animated: true,
        animationDirection: "back"
    }
    this.navController.back(animations);
  }
}