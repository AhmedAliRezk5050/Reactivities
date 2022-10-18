import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { appBrowserHistory } from '../../routing/AppRouter';
import Activity from '../models/activity';
// import Activity from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ResponseData>) => {
    const { response } = error;
    const status = response?.status;
    let errorMessage = 'Unkown Error occured';
    console.error(error);
    if (response && status) {
      switch (status) {
        case 400:
          const validationErrors = response.data.validationErrors;
          const errors: string[] = [];

          if (validationErrors) {
            for (const key in validationErrors) {
              errors.push(...validationErrors[key]);
            }
          }
          debugger;
          errorMessage = 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 404:
          errorMessage = 'Not found';
          appBrowserHistory.replace('/not-found');
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

class ActivityApi extends Api<ApiActivity> {
  protected baseUrl = '/activities';

  getAll() {
    return super.list(this.baseUrl);
  }

  get(id: string) {
    return super.details(this.makeActivityUrl(id));
  }

  create(activity: ApiActivity) {
    debugger;
    return super.add(this.baseUrl, activity);
  }

  update(id: string, activity: ApiActivity) {
    return super.edit(this.makeActivityUrl(id), activity);
  }

  delete(id: string) {
    return super.remove(this.makeActivityUrl(id));
  }
}

export const activityApi = new ActivityApi();

interface ResponseData {
  validationErrors?: ValidationErrors;
  info?: ResponseDataInfo;
}

interface ValidationErrors {
  [key: string]: string[];
}

interface ResponseDataInfo {
  type: string;
  title: string;
  status: number;
  traceId: string;
}

interface ApiActivity extends Omit<Activity, 'date'> {
  date: Date;
}
