import { FC } from 'react';
import { Card, Header, Tab, Image } from 'semantic-ui-react';
import { Photo } from '../../app/models/profile';

interface Props {
  photos: Photo[];
}

const ProfilePhotos: FC<Props> = ({ photos }) => {
  return (
    <Tab.Pane>
      <Header icon='image' content='Photos' />
      <Card.Group itemsPerRow={5}>
        {photos.map((photo) => (
          <Card key={photo.id}>
            <Image src={photo.url} />
          </Card>
        ))}
      </Card.Group>
    </Tab.Pane>
  );
};

export default ProfilePhotos;
