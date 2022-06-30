// eslint-disable-next-line @typescript-eslint/naming-convention
export type FriendRequest_Status = 'not-sent' | 'pending' | 'accepted' | 'declined' | 'waiting';

export interface FriendRequestStatus {

  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id: number;
  status?: FriendRequest_Status;
  receiverId: number;
  creatorId: number;
}
