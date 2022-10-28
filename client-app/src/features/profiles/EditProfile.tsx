import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, GridColumn, Header, Tab } from 'semantic-ui-react';
import AppSpinner from '../../app/layout/AppSpinner';
import { useStore } from '../../app/stores/store';
import AppTextArea from '../formik/AppTextArea';
import AppTextInput from '../formik/AppTextInput';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';

interface FormData {
  displayName: string;
  bio: string;
}

const EditProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { profileStore } = useStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    bio: '',
  });
  useEffect(() => {
    if (username) {
      profileStore.loadProfile(username).then(() => {
        setFormData({
          displayName: profileStore.profile?.displayName ?? '',
          bio: profileStore.profile?.bio ?? '',
        });
      });
    }
  }, [profileStore, username]);

  if (!profileStore.profile && profileStore.profileLoading) {
    return <AppSpinner text='Loading profile ...' />;
  }
  const formValidationSchema: Yup.SchemaOf<{ displayName: string }> =
    Yup.object().shape({
      displayName: Yup.string().required(),
    });

  return (
    <Tab.Pane>
      <Grid>
        <GridColumn width={13}>
          <Header icon='user' content={profileStore.profile!.displayName} />
        </GridColumn>
        <GridColumn width={3} textAlign='right'>
          <Button
            content={editMode ? 'Cancel' : 'Edit'}
            onClick={() => {
              setEditMode((state) => !state);
              setFormData({
                displayName: profileStore.profile?.displayName ?? '',
                bio: profileStore.profile?.bio ?? '',
              });
            }}
          />
        </GridColumn>
        <GridColumn width={16}>
          {editMode && (
            <Formik
              initialValues={formData}
              validationSchema={formValidationSchema}
              onSubmit={async (values) => {
                try {
                  await profileStore.updateProfile(
                    values.displayName,
                    values.bio,
                  );
                  setEditMode(false);
                } catch (error) {}
              }}
            >
              {({ touched, isValid, isSubmitting }) => (
                <Form className='ui form error'>
                  <AppTextInput name='displayName' placeholder='Display Name' />
                  <AppTextArea name='bio' placeholder='Bio' rows={3} />
                  <Button
                    floated='left'
                    positive
                    type='submit'
                    content='Submit'
                    loading={isSubmitting}
                    disabled={
                      !isValid ||
                      isSubmitting ||
                      (Object.keys(touched).length === 0 &&
                        touched.constructor === Object)
                    }
                  />
                </Form>
              )}
            </Formik>
          )}
        </GridColumn>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(EditProfile);
