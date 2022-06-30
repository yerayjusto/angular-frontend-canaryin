import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdversitingComponent } from './components/adversiting/adversiting.component';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { ModalComponent } from './components/start-post/modal/modal.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ConnProfileComponent } from './components/conn-profile/conn-profile.component';
import { PopoverComponent } from './components/header/popover/popover.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FriendRequestsPopoverComponent } from './components/header/friend-requests-popover/friend-requests-popover.component';
import { ChatComponent } from './components/chat/chat.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  // eslint-disable-next-line max-len
  declarations: [HomePage, HeaderComponent, ProfileSummaryComponent, StartPostComponent,
    AdversitingComponent, ModalComponent, AllPostsComponent, TabsComponent, ConnProfileComponent,
    PopoverComponent, UserProfileComponent, FriendRequestsPopoverComponent, ChatComponent]
})
export class HomePageModule {}
