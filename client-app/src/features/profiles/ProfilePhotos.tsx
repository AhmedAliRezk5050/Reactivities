import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
  Card,
  Header,
  Tab,
  Image,
  Grid,
  Button,
  ButtonGroup,
} from 'semantic-ui-react';
import PhotoUploadWidget from '../../common/photo-upload/PhotoUploadWidget';
import { useStore } from '../../app/stores/store';

const ProfilePhotos = () => {
  const { profileStore } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [pendingMainPhotoId, setPendingMainPhotoId] = useState('');

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
              {profileStore.profile!.photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />

                  {profileStore.isAuthenticatedProfile && (
                    <ButtonGroup fluid widths={2}>
                      <Button
                        basic
                        color='green'
                        content='Main'
                        disabled={photo.isMain}
                        onClick={() => {
                          setPendingMainPhotoId(photo.id);
                          profileStore.makePhotoMain(photo).then(() => {
                            setPendingMainPhotoId('');
                          });
                        }}
                        loading={
                          pendingMainPhotoId === photo.id &&
                          profileStore.makePhotoMainLoading
                        }
                      />
                      <Button
                        basic
                        color='red'
                        disabled={photo.isMain}
                        icon='trash'
                        onClick={() => {
                          setPendingMainPhotoId(photo.id);
                          profileStore.deletePhoto(photo.id).then(() => {
                            setPendingMainPhotoId('');
                          });
                        }}
                        loading={
                          pendingMainPhotoId === photo.id &&
                          profileStore.deletePhotoLoading
                        }
                      />
                    </ButtonGroup>
                  )}
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
