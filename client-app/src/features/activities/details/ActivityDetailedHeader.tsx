import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import Activity from '../../../app/models/activity';
import { Item, Segment, Image, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
  filter: 'brightness(30%)',
};

const activityImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

interface Props {
  activity: Activity;
}

const ActivityDetailedHeader: FC<Props> = ({ activity }) => {
  const { activityStore } = useStore();
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        {activity.isCancelled && (
          <Label
            style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color='red'
            content='Cancelled'
          ></Label>
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date, 'dd MMM yyy')}</p>
                <span style={{ marginRight: '5px' }}>Hosted by</span>
                <Label
                  size='small'
                  as={Link}
                  to={`/profiles/${activity.host?.userName}`}
                >
                  {activity.host?.displayName}
                </Label>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {!activity.isHost && (
          <Button
            onClick={activityStore.updateAttendance}
            loading={activityStore.attendanceLoading}
            disabled={activity.isCancelled}
          >
            {activity.isGoing ? 'Cancel attendance' : 'Join Activity'}
          </Button>
        )}
        {activity.isHost && (
          <>
            <Button
              floated='right'
              as={Link}
              to={`/activities/${activity.id}/edit`}
              disabled={activity.isCancelled}
            >
              Manage Event
            </Button>
            <Button
              color={activity.isCancelled ? 'green' : 'red'}
              floated='left'
              content={
                activity.isCancelled
                  ? 'Re-activate Activity'
                  : 'Cancel Activity'
              }
              onClick={activityStore.cancelActivityToggle}
              loading={activityStore.toggleIsCanceledLoading}
            />
          </>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
