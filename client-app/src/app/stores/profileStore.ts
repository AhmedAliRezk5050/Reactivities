import { profilesApi } from './../api/agent';
import { Profile } from './../models/profile';
import { makeAutoObservable } from 'mobx';
export default class ProfileStore {
  profile: Profile | null = null;
  profileLoading: boolean = true;

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

  setProfile = (profile: Profile | null) => {
    this.profile = profile;
  };

  setProfileLoading = (status: boolean) => (this.profileLoading = status);
}
