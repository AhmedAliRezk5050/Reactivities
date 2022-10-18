import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Activity from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(
  (response) => {},
  (error: AxiosError) => {
    const { response } = error;
    const status = response?.status;
    let errorMessage = 'Unkown Error occured';

    if (response && status) {
      switch (status) {
        case 400:
          errorMessage = 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 404:
          errorMessage = 'Not found';
          break;
      }
    }
    toast.error(errorMessage);
    return Promise.reject(error);
  },
);

abstract class Api<T> {
  protected abstract baseUrl: string;

  protected makeActivityUrl(id: string) {
    return `${this.baseUrl}/${id}`;
  }

  protected list(url: string) {
    return axios.get<T[]>(url);
  }

  protected details(url: string) {
    return axios.get<T>(url);
  }

  protected add(url: string, body: T) {
    return axios.post(url, body);
  }

  edit(url: string, body: T) {
    return axios.put(url, body);
  }

  protected remove(url: string) {
    return axios.delete(url);
  }
}

class ActivityApi extends Api<Activity> {
  protected baseUrl = '/activities';

  getAll() {
    return super.list(this.baseUrl);
  }

  get(id: string) {
    return super.details(this.makeActivityUrl(id));
  }

  create(activity: Activity) {
    return super.add(this.baseUrl, activity);
  }

  update(id: string, activity: Activity) {
    return super.edit(this.makeActivityUrl(id), activity);
  }

  delete(id: string) {
    return super.remove(this.makeActivityUrl(id));
  }
}

export const activityApi = new ActivityApi();
