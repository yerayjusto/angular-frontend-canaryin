/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUser } from '../models/newUser.model';
import { Role, User } from '../models/user.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import  jwt_decode from 'jwt-decode';
import { UserResponse } from '../models/userResponse.model';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private cookies: CookieService, public jwtHelper: JwtHelperService) { }

  // get userRole(): Observable<Role> {
  //   return this.user$.asObservable().pipe(
  //     // eslint-disable-next-line arrow-body-style
  //     switchMap((user: User) => {
  //       return of(user.role);
  //     })
  //   );
  // }

  // get userFullName(): Observable<string> {
  //   return this.user$.asObservable().pipe(
  //     switchMap((user: User) => {
  //       const fullName = user.firstName + ' ' + user.lastName;
  //       return of(fullName);
  //     })
  //   );
  // }

  // get userFullImagePath(): Observable<string> {
  //   return this.user$.asObservable().pipe(
  //     switchMap((user: User) => {
  //       const doesAuthorHaveImage = !!user?.imagePath;
  //       let fullImagePath = this.getDefaultFullImagePath();
  //       if (doesAuthorHaveImage) {
  //         fullImagePath = this.getFullImagePath(user.imagePath);
  //       }
  //       return of(fullImagePath);
  //     })
  //   );
  // }

  getUserFullImagePath(): string{
    const token = this.cookies.get('token');
    const decodedToken: UserResponse = jwt_decode(token);
    const imageName: string = decodedToken.user.imagePath;
    if (imageName == null) { return this.getDefaultFullImagePath(); }
    return environment.baseApiUrl + 'feed/image/' + imageName;
  }

  getFullName() {
    const token = this.cookies.get('token');
    const decodedToken: UserResponse = jwt_decode(token);
    const fullName: string = decodedToken.user.firstName + ' ' + decodedToken.user.lastName;
    return fullName;
  }

  getDefaultFullImagePath(): string {
    return environment.baseApiUrl + 'feed/image/blank-profile-photo.jpeg';
  }

  // getFullImagePath(imageName: string): string {
  //   return environment.baseApiUrl + '/feed/image/' + imageName;
  // }

  // getUserImage() {
  //   return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  // }

  getUserImageName(): Observable<{imageName: string}> {
    return this.http.get<{imageName: string}>(`${environment.baseApiUrl}user/image-name`).pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    );
  }

  uploadUserImage(formData: FormData, userId): Observable<any> {
    return this.http.post<{modifiedFileName: string}>(
      `${environment.baseApiUrl}user/upload/${userId}`, formData).pipe(take(1));
  }
  // get isUserLoggedIn(): Observable<boolean> {
  //   return this.user$.asObservable().pipe(
  //     switchMap((user: User) => {
  //       const isUserAuth = user !== null;
  //       return of(isUserAuth);
  //     })
  //   );
  // }

  public isAuthenticated(): boolean {
    const token = this.cookies.get('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(
    `${environment.baseApiUrl}auth/register`, newUser).pipe(
      take(1)
    );
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.baseApiUrl}auth/login`,
      { email, password }).pipe(
        take(1));
  }

  isTokenInCookies(): boolean {
    const token = this.cookies.get('token');
    if (!token) { return false; }
    const decodedToken: UserResponse = jwt_decode(token);
    const jwtExpireationInMs = decodedToken.exp * 1000;
    const isExpired = new Date() > new Date(jwtExpireationInMs);
    if (isExpired) { return false; }
    if (decodedToken.user) {
      this.user$.next(decodedToken.user);
      return true; }
  }

  decodedToken(): any {
    const token = this.cookies.get('token');
    const decodedToken: UserResponse = jwt_decode(token);
    return decodedToken;
  }

  getRole() {
    const token = this.cookies.get('token');
    const decodedToken: UserResponse = jwt_decode(token);
    return decodedToken.user.role;
  }

  getUserId(): number {
    const token = this.cookies.get('token');
    const decodedToken: UserResponse = jwt_decode(token);
    return parseInt(decodedToken.user.id, 10);
  }

  validateToken(){
    let token = this.cookies.get('token');
    token = 'Bearer ' + token;
    const httpOptions = {
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: token
      })
    };
    return httpOptions;
  }

  setToken(token: any) {
    this.cookies.set('token', token);
    const decodedToken: UserResponse = jwt_decode(token);
    this.user$.next(decodedToken.user);
  }

  refreshtoken(userId: number): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.baseApiUrl}user/refreshtoken/${userId}`, this.validateToken());
  }

  logOut() {
    this.user$.next(null);
    window.location.reload();
    this.router.navigate(['/auth']);
    this.cookies.delete('token');
  }
}
