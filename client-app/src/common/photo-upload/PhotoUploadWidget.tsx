import { observer } from 'mobx-react-lite';
import { useEffect, useState, FC } from 'react';
import { Button, Grid, GridColumn, Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import CropperPhotoWidget from './CropperPhotoWidget';
import DropZonePhotoWidget from './DropZonePhotoWidget';

interface Props {
  onPhotoUpload: (file: Blob) => void;
}

const PhotoUploadWidget: FC<Props> = ({ onPhotoUpload }) => {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();
  const { profileStore } = useStore();
  const onCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => blob && onPhotoUpload(blob));
    }
  };

  useEffect(() => {
    return () => {
      // clean from memory after component destructuring
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid style={{ textAlign: 'center' }}>
      <Grid.Column width={1} />
      <GridColumn width={4}>
        <Header color='grey'>
          <p>Step 1</p>
          <p>Add Photo</p>
          <DropZonePhotoWidget setFiles={setFiles} />
        </Header>
      </GridColumn>
      <Grid.Column width={1} />
      <GridColumn width={4}>
        <Header color='grey'>
          <p>Step 2</p>
          <p>Resize Image</p>
        </Header>
        {files.length > 0 && (
          <CropperPhotoWidget
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </GridColumn>
      <Grid.Column width={1} />
      <GridColumn width={4}>
        <Header color='grey'>
          <p>Step 3</p>
          <p>Preview & Upload</p>
          {files.length > 0 && (
            <>
              <div
                className='img-preview'
                style={{
                  minHeight: 200,
                  overflow: 'hidden',
                  marginBottom: '10px',
                }}
              />
              <Button.Group>
                <Button
                  onClick={onCrop}
                  positive
                  icon='check'
                  loading={profileStore.photoUploadLoading}
                />
                <Button
                  onClick={() => setFiles([])}
                  icon='close'
                  disabled={profileStore.photoUploadLoading}
                />
              </Button.Group>
            </>
          )}
        </Header>
      </GridColumn>
    </Grid>
  );
};

export default observer(PhotoUploadWidget);
