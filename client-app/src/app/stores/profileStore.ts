import { store } from './store';
import { profilesApi } from './../api/agent';
import { Profile, Photo } from './../models/profile';
import { makeAutoObservable } from 'mobx';
export default class ProfileStore {
  profile: Profile | null = null;
  profileLoading: boolean = true;
  photoUploadLoading: boolean = false;

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
    this.profile && this.profile.photos?.push(photo);

  setImage = (image: string) => {
    if (this.profile) {
      this.profile.image = image;
    }
  };
}
