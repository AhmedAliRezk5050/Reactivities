import { Profile } from './profile';

export default interface Activity {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUserName?: string;
  isCancelled?: boolean;
  isGoing?: boolean;
  isHost?: boolean;
  host?: Profile;
  attendees?: Profile[];
}

export class ActivityFormValues {
  id?: string;
  title: string = '';
  date: Date | null = null;
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.date = activity.date;
      this.description = activity.description;
      this.category = activity.category;
      this.city = activity.city;
      this.venue = activity.venue;
    }
  }
}
