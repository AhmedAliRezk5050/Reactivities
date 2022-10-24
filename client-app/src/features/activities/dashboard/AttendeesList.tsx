import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { List, Image } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';

interface Props {
  attendees: Profile[];
}

const AttendeesList: FC<Props> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item
          key={attendee.userName}
          as={Link}
          to={`/profiles/${attendee.userName}`}
        >
          <Image
            size='mini'
            circular
            src={`${attendee.image ?? '/assets/user.png'}`}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default observer(AttendeesList);
