import { Segment, List, Label, Item, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Profile } from '../../../app/models/profile';
import { FC } from 'react';
import Activity from '../../../app/models/activity';

interface Props {
  activity: Activity;
}

const ActivityDetailedSidebar: FC<Props> = ({
  activity: { attendees, host },
}) => {
  if (!attendees) return null;

  return (
    <>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
      >
        {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(({ displayName, image, userName }) => (
            <Item style={{ position: 'relative' }} key={userName}>
              {userName === host?.userName && (
                <Label
                  style={{ position: 'absolute' }}
                  ribbon='right'
                  color='olive'
                >
                  Host
                </Label>
              )}

              <Image size='tiny' src={image ?? '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={`/profiles/${userName}`}>{displayName}</Link>
                </Item.Header>
                <Item.Extra>Following</Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </>
  );
};

export default observer(ActivityDetailedSidebar);
