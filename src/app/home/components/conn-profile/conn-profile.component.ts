import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { stringify } from 'querystring';
import { Observable, ObservedValuesFromArray, Subscriber, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { FriendRequestStatus, FriendRequest_Status } from '../../models/friend-request';
import { BannerColorService } from '../../services/banner-color.service';
import { ConnProfileService } from '../../services/conn-profile.service';


@Component({
  selector: 'app-conn-profile',
  templateUrl: './conn-profile.component.html',
  styleUrls: ['./conn-profile.component.scss'],
})
export class ConnProfileComponent implements OnInit, OnDestroy {
  user: User;
  currentUserId: string;
  paramId: string;
  friendRequestStatus: FriendRequest_Status;
  friendRequestStatusSubscription$: Subscription;
  userSubscription$: Subscription;

  constructor(public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    private connProfileService: ConnProfileService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getUserIdFromUrl().subscribe((id: number) => {
      this.paramId = id.toString();
      this.currentUserId = this.authService.getUserId().toString();
    });

    this.friendRequestStatusSubscription$ = this.getFriendRequestStatus().pipe(
      tap((friendRequestStatus: FriendRequestStatus) => {
        this.friendRequestStatus = friendRequestStatus.status;
        this.userSubscription$ = this.getUser().subscribe((user: User) => {
          this.user = user;
          const imgPath = user.imagePath ?? 'blank-profile-photo.jpeg';
          // eslint-disable-next-line @typescript-eslint/dot-notation
          this.user['fullImagePath'] = `${environment.baseApiUrl}feed/image/` + imgPath;
        });
      })
    ).subscribe();
  }

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => this.connProfileService.getConnectionUser(userId))
    );
  }

  addUser(): Subscription {
    this.friendRequestStatus = 'pending';
    return this.getUserIdFromUrl()
    .pipe(
      switchMap((userId: number) => this.connProfileService.addConnUser(userId))
    )
    .pipe(take(1))
    .subscribe();
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => this.connProfileService.getFriendRequestStatus(userId))
    );
  }

  ngOnDestroy() {
    this.friendRequestStatusSubscription$.unsubscribe();
    this.userSubscription$.unsubscribe();
    }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => +urlSegment[0].path)
    );
  }
}
