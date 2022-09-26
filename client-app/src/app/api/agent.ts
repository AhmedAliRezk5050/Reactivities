import axios from "axios";
import Activity from "../models/activity";

axios.defaults.baseURL = 'http://localhost:5000/api';


abstract class Api<T> {
    public List(url: string) {
        return axios.get<T>(url)
    }

    public Add(url: string, body: {}) {
        return axios.post(url, body)
    }

    public Edit(url: string, body: {}) {
        return axios.post(url, body)
    }

    public Remove(url: string) {
        return axios.delete(url)
    }
}


class ActivityApi extends Api<Activity[]> {

    private readonly url = '/activities'


    List() {
        return super.List(this.url);
    }
}

export const activityApi = new ActivityApi();