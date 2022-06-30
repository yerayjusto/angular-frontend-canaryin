import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  imagePath: string;
  fullName: string;
  constructor(private authService: AuthService, public popoverController: PopoverController) { }

  ngOnInit() {
    this.imagePath = this.authService.getUserFullImagePath();
    this.fullName = this.authService.getFullName();
  }

  onSignOut() {
    this.popoverController.dismiss();
    this.authService.logOut();
  }
}
