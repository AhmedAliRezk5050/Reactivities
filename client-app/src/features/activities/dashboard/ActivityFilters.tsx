import { Header, Menu } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

const ActivityFilters = () => {
  const { activityStore } = useStore();
  const { setFilterParams } = activityStore;
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
          onClick={() => setFilterParams('all')}
          active={activityStore.filterParams.all}
        />
        <Menu.Item
          content="I'm going"
          onClick={() => setFilterParams('isGoing')}
          active={activityStore.filterParams.isGoing}
        />
        <Menu.Item
          content="I'm hosting"
          onClick={() => setFilterParams('isHost')}
          active={activityStore.filterParams.isHost}
        />
      </Menu>
      <Header />
      <Calendar onChange={(date: Date) => setFilterParams('startDate', date)} />
    </>
  );
};

export default observer(ActivityFilters);
