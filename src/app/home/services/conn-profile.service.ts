import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { FriendRequest, FriendRequestStatus } from '../models/friend-request';

@Injectable({
  providedIn: 'root'
})
export class ConnProfileService {
  friendRequests: FriendRequest[];

  constructor(private http: HttpClient, private authService: AuthService) { }

  getConnectionUser(id: number): Observable<User> {
    const httpOptions = this.authService.validateToken();
    return this.http.get<User>(`${environment.baseApiUrl}user/${id}`, httpOptions);
  }

  getFriendRequestStatus(id: number): Observable<FriendRequestStatus> {
    const httpOptions = this.authService.validateToken();
    return this.http.get<FriendRequestStatus>(`${environment.baseApiUrl}user/friend-request/status/${id}`, httpOptions);
  }

  addConnUser(id: number): Observable<FriendRequest | { error: string }> {
    const httpOptions = this.authService.validateToken();
    return this.http.post<FriendRequest | { error: string }>(`${environment.baseApiUrl}user/friend-request/send/${id}`, {}, httpOptions);
  }

  getFriendRequests(): Observable<FriendRequest[]> {
    const httpOptions = this.authService.validateToken();
    return this.http.get<FriendRequest[]>(`${environment.baseApiUrl}user/friend-request/me/received-requests`, httpOptions);
  }

  respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined'): Observable<FriendRequest> {
    const httpOptions = this.authService.validateToken();
    return this.http.put<FriendRequest>(`${environment.baseApiUrl}user/friend-request/response/${id}`,
    { status: statusResponse },
    httpOptions);
  }
}
