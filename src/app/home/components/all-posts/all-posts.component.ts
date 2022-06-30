import { Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalComponent } from '../start-post/modal/modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit, OnChanges {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  @Input() postBody?: string;

  queryParams: string;
  userId: number;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;
  fullName: string;
  imagePath: string;
  defaultImage: string;
  urlImage: string;
  constructor(private postService: PostService, private authService: AuthService, public modalController: ModalController) { }

  ngOnInit() {
    this.getPosts(false, '');
    this.imagePath = this.authService.getUserFullImagePath();
    this.fullName = this.authService.getFullName();
    this.defaultImage = 'blank-profile-photo.jpeg';
    this.urlImage = environment.baseApiUrl + 'feed/image/';
  }

  ngOnChanges(changes: SimpleChanges): void {
    const postBody = changes.postBody.currentValue;
    if(!postBody) { return; }
    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.allLoadedPosts.unshift(post);
    });
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    const token = this.authService.decodedToken();
    this.userId = token.user.id;
    this.queryParams = `?userId=${this.userId}&take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.postService.getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
      for (const post of posts) {
        this.allLoadedPosts.push(post);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      if (isInitialLoad) {event.target.complete();}
      this.skipPosts = this.skipPosts +5;
    });
  }

  loadData(event) {
    this.getPosts(true, event);
  }

  async presentUpdateModal(postId: number) {
    console.log('EDIT POST');
      const modal = await this.modalController.create({
        component: ModalComponent,
        cssClass: 'my-custom-class2',
        componentProps: {
          postId,
        }
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (!data)  { return; }
      const newPostBody = data.post.body;
      this.postService.updatePost(postId, newPostBody).subscribe(() => {
        const postIndex = this.allLoadedPosts.findIndex((post: Post) => post.id === postId);
        this.allLoadedPosts[postIndex].body = newPostBody;
      });
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter((post: Post) => post.id !== postId);
    });
  }
}
