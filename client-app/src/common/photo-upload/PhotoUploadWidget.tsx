import { useEffect, useState } from 'react';
import { Button, Grid, GridColumn, Header } from 'semantic-ui-react';
import CropperPhotoWidget from './CropperPhotoWidget';
import DropZonePhotoWidget from './DropZonePhotoWidget';

const PhotoUploadWidget = () => {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => console.log(blob));
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
                <Button onClick={onCrop} positive icon='check' />
                <Button onClick={() => setFiles([])} icon='close' />
              </Button.Group>
            </>
          )}
        </Header>
      </GridColumn>
    </Grid>
  );
};

export default PhotoUploadWidget;
