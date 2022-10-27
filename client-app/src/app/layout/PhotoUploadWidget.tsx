import { Grid, GridColumn, Header } from 'semantic-ui-react';

const PhotoUploadWidget = () => {
  return (
    <Grid style={{ textAlign: 'center' }}>
      <Grid.Column width={1} />
      <GridColumn width={4}>
        <Header color='grey'>
          <p>Step 1</p>
          <p>Add Photo</p>
        </Header>
      </GridColumn>
      <Grid.Column width={1} />
      <GridColumn width={4}>
        <Header color='grey'>
          <p>Step 2</p>
          <p>Resize Image</p>
        </Header>
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
