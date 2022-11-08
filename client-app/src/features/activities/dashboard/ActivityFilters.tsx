import { Header, Menu } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () => {
  const { activityStore } = useStore();
  const { setPredicate } = activityStore;
  return (
    <>
      <Menu
        vertical
        size='large'
        style={{ width: '100%', marginTop: '1.9rem' }}
      >
        <Header icon='filter' attached content='Filters' />
        <Menu.Item
          content='All Activities'
          active={activityStore.predicate.has('all')}
          onClick={() => setPredicate('all')}
        />
        <Menu.Item
          content="I'm going"
          active={activityStore.predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing')}
        />
        <Menu.Item
          content="I'm hosting"
          active={activityStore.predicate.has('isHost')}
          onClick={() => setPredicate('isHost')}
        />
      </Menu>
      <Header />
      <Calendar
        onChange={(date: Date) => setPredicate('startDate', date)}
        value={activityStore.predicate.get('startDate') || new Date()}
      />
    </>
  );
};

export default observer(ActivityFilters);
