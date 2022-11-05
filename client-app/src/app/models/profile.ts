import { User } from './user';

export interface Profile {
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
  photos: Photo[];
  isFollowing: boolean;
  followingCount: number;
  followersCount: number;
}

export class UserProfile implements Profile {
  userName: string;
  displayName: string;
  bio?: string | undefined;
  image?: string | undefined;
  photos: Photo[] = [];
  isFollowing = false;
  followingCount = 0;
  followersCount = 0;

  constructor(user: User) {
    this.userName = user.userName;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
