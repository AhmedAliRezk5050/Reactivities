import { User } from './user';

export interface Profile {
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
  photos?: Photo[];
}

export class UserProfile implements Profile {
  userName: string;
  displayName: string;
  bio?: string | undefined;
  image?: string | undefined;
  photos?: Photo[];

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
