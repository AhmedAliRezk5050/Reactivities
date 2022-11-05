import { store } from './store';
import { profilesApi } from './../api/agent';
import { Profile, Photo } from './../models/profile';
import { makeAutoObservable } from 'mobx';
export default class ProfileStore {
  profile: Profile | null = null;
  profileLoading: boolean = true;
  photoUploadLoading: boolean = false;
  makePhotoMainLoading: boolean = false;
  deletePhotoLoading: boolean = false;
  profileUpdateLoading: boolean = true;
  updateFollowStatusLoading = false;
  followings: Profile[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  loadProfile = async (username: string) => {
    this.setProfileLoading(true);
    try {
      const { data } = await profilesApi.get(username);
      this.setProfile(data);
    } catch (error) {
      this.setProfile(null);
    } finally {
      this.setProfileLoading(false);
    }
  };

  updateProfile = async (displayName: string, bio?: string) => {
    try {
      this.setProfileUpdateLoading(true);
      await profilesApi.update(displayName, bio);
      this.editProfileData(displayName, bio);
      store.authStore.setDisplayName(displayName);
    } catch (error) {
      throw error;
    } finally {
      this.setProfileUpdateLoading(false);
    }
  };

  uploadPhoto = async (file: Blob) => {
    try {
      this.setPhotoUploadLoading(true);
      const { data } = await profilesApi.uploadPhoto(file);
      this.pushToProfilePhotos(data);
      if (data.isMain && store.authStore.user) {
        store.authStore.setImage(data.url);
        this.setImage(data.url);
      }
    } catch (error) {
    } finally {
      this.setPhotoUploadLoading(false);
    }
  };

  makePhotoMain = async (photo: Photo) => {
    try {
      this.setMakePhotoMainLoading(true);
      await profilesApi.setMainPhoto(photo.id);
      store.authStore.setImage(photo.url);
      this.setProfileMainPhoto(photo.id);
      this.setImage(photo.url);
    } catch (error) {
    } finally {
      this.setMakePhotoMainLoading(false);
    }
  };

  deletePhoto = async (photoId: string) => {
    this.setDeletePhotoLoading(true);
    try {
      await profilesApi.delete(photoId);
      this.removePhotoFromProfile(photoId);
    } catch (error) {
    } finally {
      this.setDeletePhotoLoading(false);
    }
  };

  get isAuthenticatedProfile() {
    const { user } = store.authStore;
    return user && this.profile && user.userName === this.profile.userName;
  }

  setProfile = (profile: Profile | null) => {
    this.profile = profile;
  };

  setProfileLoading = (status: boolean) => (this.profileLoading = status);

  setPhotoUploadLoading = (status: boolean) =>
    (this.photoUploadLoading = status);

  pushToProfilePhotos = (photo: Photo) =>
    this.profile && this.profile.photos.push(photo);

  setImage = (url: string) => {
    if (this.profile) {
      this.profile.image = url;
    }
  };

  setMakePhotoMainLoading = (status: boolean) =>
    (this.makePhotoMainLoading = status);

  setProfileMainPhoto = (photoId: string) => {
    if (this.profile) {
      this.profile.photos.find((p) => p.isMain)!.isMain = false;
      this.profile.photos.find((p) => p.id === photoId)!.isMain = true;
    }
  };

  setDeletePhotoLoading = (status: boolean) =>
    (this.deletePhotoLoading = status);

  removePhotoFromProfile = (photoId: string) => {
    if (this.profile) {
      this.profile.photos = this.profile.photos.filter((p) => p.id !== photoId);
    }
  };

  setProfileUpdateLoading = (status: boolean) =>
    (this.deletePhotoLoading = status);

  editProfileData = (displayName: string, bio?: string) => {
    if (this.profile) {
      this.profile.displayName = displayName;
      this.profile.bio = bio;
    }
  };

  updateFollowStatus = async (username: string, followStatus: boolean) => {
    this.setUpdateFollowStatusLoading(true);
    try {
      await profilesApi.updateFollowStatus(username);
      store.activityStore.updateAttendeesFollowStatus(username);
      this.updateProfileFollowStatus(followStatus);
      this.updateFollowings(username);
    } catch (error) {}
    this.setUpdateFollowStatusLoading(false);
  };

  updateProfileFollowStatus = (followStatus: boolean) => {
    if (
      this.profile &&
      this.profile.userName !== store.authStore.user?.userName
    ) {
      followStatus
        ? this.profile.followersCount++
        : this.profile.followersCount--;

      this.profile.isFollowing = !this.profile.isFollowing;
    }
  };

  updateFollowings = (username: string) => {
    this.followings.forEach((profile) => {
      if (profile.userName === username) {
        profile.isFollowing
          ? profile.followersCount--
          : profile.followersCount++;
      }
    });
  };

  setUpdateFollowStatusLoading = (status: boolean) => {
    this.updateFollowStatusLoading = status;
  };
}
