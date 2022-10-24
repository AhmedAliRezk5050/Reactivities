import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import Activity from '../../../app/models/activity';
import { Item, Segment, Image, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

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
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
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
        {!activity.isHost && !activity.isGoing && (
          <Button>Join Activity</Button>
        )}
        {!activity.isHost && activity.isGoing && (
          <Button>Cancel attendance</Button>
        )}
        {activity.isHost && (
          <Button
            floated='right'
            as={Link}
            to={`/activities/${activity.id}/edit`}
          >
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
