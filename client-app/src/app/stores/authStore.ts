import { LoginData, RegisterData } from './../models/user';
import { makeAutoObservable, reaction } from 'mobx';
import { User } from '../models/user';
import { authApi } from '../api/agent';
import { appBrowserHistory } from '../../routing/AppRouter';
import { store } from './store';

export default class AuthStore {
  user: User | null = null;
  authLoading = false;
  refreshTokenTimer: any;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.user,
      (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', user.token);
          this.startRefreshTokenTimer();
          appBrowserHistory.replace('/activities');
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          appBrowserHistory.replace('/');
          if (this.refreshTokenTimer) {
            this.clearRefreshTokenTimer();
          }
        }
        store.modalStore.closeModal();
      },
    );
  }

  setUser = (user: User | null) => (this.user = user);

  login = async (loginData: LoginData) => {
    this.authLoading = true;
    try {
      const response = await authApi.login(loginData);
      this.setUser(response.data);
    } catch (e: any) {
      this.setUser(null);
    }
    this.authLoading = false;
  };

  register = async (registerData: RegisterData) => {
    try {
      const response = await authApi.register(registerData);
      this.setUser(response.data);
    } catch (e: any) {
      this.setUser(null);
      throw e;
    }
  };

  logout = () => {
    if (this.user !== null) {
      this.setUser(null);
    }
  };

  facebookLogin = () => {
    this.authLoading = true;
    FB.login(
      (response) => {
        if (response.status === 'connected') {
          authApi
            .fbLogin(response.authResponse.accessToken)
            .then(({ data }) => {
              this.setUser(data);
            })
            .catch((err) => {
              console.log(err);
              this.setAuthLoading(false);
            });
        } else {
          this.setAuthLoading(false);
        }
      },
      { scope: 'public_profile,email' },
    );
  };

  refreshToken = async () => {
    try {
      const { data } = await authApi.refreshToken();
      this.setUser(data);
    } catch (error) {
      this.setUser(null);
    }
  };

  get authenticated() {
    return !!this.user;
  }

  setImage = (image: string) => {
    if (this.user) {
      this.user.image = image;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  };

  setDisplayName = (displayName: string) => {
    if (this.user) {
      this.user.displayName = displayName;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  };

  setAuthLoading = (status: boolean) => {
    this.authLoading = status;
  };

  startRefreshTokenTimer = () => {
    if (!this.user) return;
    const token = this.user.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp as number;

    const interval = expiry * 1000 - Date.now() - 60000;

    console.log('startRefreshTokenTimer', interval);

    this.refreshTokenTimer = setTimeout(this.refreshToken, interval);
  };
  clearRefreshTokenTimer = () => {
    clearTimeout(this.refreshTokenTimer);
  };

  authInit = () => {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      this.setUser(JSON.parse(userFromLocalStorage));
    }
  };
}
