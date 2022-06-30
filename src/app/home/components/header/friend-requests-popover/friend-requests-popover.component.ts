import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { FriendRequest } from 'src/app/home/models/friend-request';
import { ConnProfileService } from 'src/app/home/services/conn-profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {

  constructor(public connProfileService: ConnProfileService,
    private popoverController: PopoverController) { }

  ngOnInit() {
    this.connProfileService.friendRequests.map(
      (friendRequest: FriendRequest) => {
        const creatorId = (friendRequest as any)?.creator?.id;
        if (friendRequest && creatorId) {
          this.connProfileService.getConnectionUser(creatorId)
          .pipe(
            take(1),
            tap((user: User) => {
              // eslint-disable-next-line @typescript-eslint/dot-notation
              friendRequest['fullImagePath'] = `${environment.baseApiUrl}feed/image/` + (user?.imagePath ||
                'blank-profile-photo.jpeg');
            })
          ).subscribe();
        }
      }
    );
  }

  async respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined') {
    const handledFriendRequest: FriendRequest = this.connProfileService.friendRequests
    .find((friendRequest) => friendRequest.id === id);
    const unhandledFriendRequest: FriendRequest[] =
    this.connProfileService.friendRequests
    .filter((friendRequest) => friendRequest.id !== handledFriendRequest.id);
    this.connProfileService.friendRequests = unhandledFriendRequest;
    if(this.connProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss();
    }
    return this.connProfileService.respondToFriendRequest(id, statusResponse)
    .pipe(take(1))
    .subscribe();
  }
}
