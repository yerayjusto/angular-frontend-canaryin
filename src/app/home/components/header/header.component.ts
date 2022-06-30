import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FriendRequest } from '../../models/friend-request';
import { ConnProfileService } from '../../services/conn-profile.service';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  friendRequests: FriendRequest[];
  imagePath: string;
  private friendRequestsSubscription: Subscription;

  constructor(public popoverController: PopoverController, private authService: AuthService,
    public connProfileService: ConnProfileService) {}

  ngOnInit() {
    this.imagePath = this.authService.getUserFullImagePath();
    this.friendRequestsSubscription = this.connProfileService.getFriendRequests().subscribe(
      (friendRequests: FriendRequest[]) => {
        this.connProfileService.friendRequests = friendRequests.filter(
          (friendRequest: FriendRequest) =>
           friendRequest.status === 'pending'
        );
      });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async presentFriendRequestPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  ngOnDestroy() {
    this.friendRequestsSubscription.unsubscribe();
  }
}
