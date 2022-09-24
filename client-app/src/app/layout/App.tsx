import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
import Activity from "../models/activity";

interface Props {}



const App: FC<Props> = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    axios
      .get<Activity[]>('http://localhost:5000/api/activities')
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
