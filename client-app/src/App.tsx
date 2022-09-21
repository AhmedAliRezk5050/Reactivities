import { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {}

interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  venue: string;
}

const App: FC<Props> = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/activities')
      .then(({ data }) => setActivities(data));
  }, []);

  const renderActivities = activities.map((a) => (
    <div key={a.id}>
      <p>{a.title}</p>
    </div>
  ));

  return <div>{renderActivities}</div>;
};

export default App;
