import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';
import { UserProfile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
  attendees: UserProfile[];
}

const AttendeesList: FC<Props> = ({ attendees }) => {
  const imgStyles = {
    borderColor: 'orange',
    borderWidth: 2,
  };
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.userName}
          trigger={
            <List.Item
              key={attendee.userName}
              as={Link}
              to={`/profiles/${attendee.userName}`}
            >
              <Image
                size='mini'
                circular
                src={`${attendee.image ?? '/assets/user.png'}`}
                bordered
                style={attendee.isFollowing ? imgStyles : null}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
};

export default observer(AttendeesList);
