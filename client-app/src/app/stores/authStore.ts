import { LoginData } from './../models/user';
import { makeAutoObservable } from 'mobx';
import { User } from '../models/user';
import { authApi } from '../api/agent';

export default class AuthStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user: User | null) => (this.user = user);

  login = async (loginData: LoginData) => {
    try {
      const response = await authApi.login(loginData);
      this.setUser(response.data);
    } catch (e: any) {
      this.setUser(null);
    }
  };
}
