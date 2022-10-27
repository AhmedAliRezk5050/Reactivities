import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import PhotoUploadWidget from '../../common/photo-upload/PhotoUploadWidget';
import { Photo } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
  photos: Photo[];
}

const ProfilePhotos: FC<Props> = ({ photos }) => {
  const { profileStore } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);

  const handlePhotoUpload = (file: Blob) => {
    profileStore.uploadPhoto(file).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='image' content='photos' />
          {profileStore.isAuthenticatedProfile && (
            <Button
              floated='right'
              basic
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
              onClick={() => setAddPhotoMode((state) => !state)}
            ></Button>
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget onPhotoUpload={handlePhotoUpload} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
