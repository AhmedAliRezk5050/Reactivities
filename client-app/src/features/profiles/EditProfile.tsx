import { Grid, GridColumn, Tab } from 'semantic-ui-react';

const EditProfile = () => {
  return (
    <Tab.Pane>
      <Grid>
        <GridColumn width={16}>
          <h1>Edit</h1>
        </GridColumn>
      </Grid>
    </Tab.Pane>
  );
};

export default EditProfile;
