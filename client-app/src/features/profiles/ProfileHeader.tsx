import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  ItemGroup,
  Reveal,
  Segment,
  Statistic,
  StatisticGroup,
} from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';

interface Props {
  profile: Profile;
}

const ProfileHeader: FC<Props> = ({ profile }) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <ItemGroup>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.image ?? '/assets/user.png'}
              />
              <Item.Content verticalAlign='middle'>
                <Header as='h1' content={profile.displayName} />
              </Item.Content>
            </Item>
          </ItemGroup>
        </Grid.Column>
        <Grid.Column width={4}>
          <StatisticGroup widths={2}>
            <Statistic label='Follower' value={5} />
            <Statistic label='Follower' value={42} />
          </StatisticGroup>
          <Divider />
          <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
              <Button fluid content='Following' />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
              <Button fluid basic content='Unfollow' />
            </Reveal.Content>
          </Reveal>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
