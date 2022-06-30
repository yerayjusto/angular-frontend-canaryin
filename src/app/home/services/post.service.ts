import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/error.handler.service';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private authService: AuthService,
    private cookies: CookieService, private errorHandlerService: ErrorHandlerService) {
  }

  getSelectedPosts(params) {
    return this.http.get<Post[]>(
      `${environment.baseApiUrl}feed${params}`, this.authService.validateToken()).pipe(
        tap((posts: Post[]) => {
          if (posts.length === 0) {  throw new Error('No posts to retrieve'); }
        }),
        catchError(
          this.errorHandlerService.handleError<Post[]>('getSelectedPosts', [])
        )
      );
  }

  createPost(body: string) {
    return this.http.post<Post>(
      `${environment.baseApiUrl}feed`, { body }, this.authService.validateToken()).pipe(
        take(1));
  }

  updatePost(postId: number, body: string) {
    return this.http.put(
      `${environment.baseApiUrl}feed/${postId}`, { body }, this.authService.validateToken()).pipe(
        take(1));
  }

  deletePost(postId: number) {
    return this.http.delete(
      `${environment.baseApiUrl}feed/${postId}`, this.authService.validateToken()).pipe(
        take(1));
  }
}
