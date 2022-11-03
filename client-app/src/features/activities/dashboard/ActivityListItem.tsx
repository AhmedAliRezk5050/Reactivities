import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import Activity from '../../../app/models/activity';
import { format } from 'date-fns';
import AttendeesList from './AttendeesList';

interface Props {
  activity: Activity;
}

const ActivityListItem: FC<Props> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached='top'
            color='red'
            content='Canceled'
            style={{ textAlign: 'center' }}
          ></Label>
        )}
        <Item.Group>
          <Item>
            <div className='ui tiny circular image'>
              <Item.Image
                size='tiny'
                circular
                src={activity.host?.image ?? '/assets/user.png'}
              />
            </div>
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by {activity.host?.displayName}
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color='olive'>
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color='brown'>
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {format(activity.date, 'dd MMM yyy')}
          <Icon name='marker' /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <AttendeesList attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
