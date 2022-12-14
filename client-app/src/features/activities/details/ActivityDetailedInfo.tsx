import { observer } from 'mobx-react-lite';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import Activity from '../../../app/models/activity';
import { FC } from 'react';
import { format } from 'date-fns';

interface Props {
  activity: Activity;
}

const ActivityDetailedInfo: FC<Props> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{activity.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{format(activity.date, 'dd MMM yyy')}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='marker' size='large' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>
              {activity.venue}, {activity.city}
            </span>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedInfo);
