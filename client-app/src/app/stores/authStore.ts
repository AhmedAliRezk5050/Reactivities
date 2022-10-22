import { LoginData } from './../models/user';
import { makeAutoObservable, reaction } from 'mobx';
import { User } from '../models/user';
import { authApi } from '../api/agent';

export default class AuthStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.setUser(JSON.parse(userFromLocalStorage));
    }

    reaction(
      () => this.user,
      (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', user.token);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      },
    );
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

  get authenticated() {
    return !!this.user;
  }
}
