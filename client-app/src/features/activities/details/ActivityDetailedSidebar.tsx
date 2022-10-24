import { Segment, List, Label, Item, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Profile } from '../../../app/models/profile';
import { FC } from 'react';

interface Props {
  attendees: Profile[];
}

const ActivityDetailedSidebar: FC<Props> = ({ attendees }) => {
  return (
    <>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
      >
        3 People Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(({ displayName, image, userName }) => (
            <Item style={{ position: 'relative' }}>
              <Label style={{ position: 'absolute' }} ribbon='right'>
                Host
              </Label>
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
