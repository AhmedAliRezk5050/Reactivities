import { useState } from 'react';
import { Grid, GridColumn, Header, Image } from 'semantic-ui-react';
import DropZonePhotoWidget from './DropZonePhotoWidget';

const PhotoUploadWidget = () => {
  const [files, setFiles] = useState<any>([]);
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
        {files.length > 0 && <Image src={files[0].preview} />}
      </GridColumn>
      <Grid.Column width={1} />
      <GridColumn width={4}>
        <Header color='grey'>
          <p>Step 3</p>
          <p>Preview & Upload</p>
        </Header>
      </GridColumn>
    </Grid>
  );
};

export default PhotoUploadWidget;
