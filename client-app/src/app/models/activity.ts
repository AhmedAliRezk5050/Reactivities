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
  attendees?: Profile[];
}
