import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

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

  const renderActivities = () => (
    <List>
      {activities.map((activity) => (
        <List.Item key={activity.id}>{activity.title}</List.Item>
      ))}
    </List>
  );
  return (
    <div>
      <Header as='h2' icon='users' content='Activities' />
      {renderActivities()}
    </div>
  );
};

export default App;
