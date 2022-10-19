import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import Activity from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import AppSpinner from '../../../app/layout/AppSpinner';
import { Form, Formik } from 'formik';
import { Button, Segment } from 'semantic-ui-react';
import AppTextInput from '../../formik/AppTextInput';
import AppTextArea from '../../formik/AppTextArea';
import AppSelectInput from '../../formik/AppSelectInput';
import AppDateInput from '../../formik/AppDateInput';

interface Props {}

interface FormData extends Omit<Activity, 'id'> {}

const ActivityForm: FC<Props> = () => {
  const { activityStore } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [localLoading, setLocalLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    description: '',
    category: '',
    venue: '',
    city: '',
  });

  useEffect(() => {
    if (id) {
      activityStore
        .fetchActivity(id)
        .then(() => {
          if (activityStore.activity) {
            setFormData({ ...activityStore.activity });
          }
        })
        .finally(() => setLocalLoading(false));
    } else {
      setFormData({
        title: '',
        date: '',
        description: '',
        category: '',
        venue: '',
        city: '',
      });
    }
  }, [id, activityStore]);

  if (id && (activityStore.activityLoading || localLoading))
    return <AppSpinner active={activityStore.activityLoading} />;

  const formValidationSchema: Yup.SchemaOf<FormData> = Yup.object().shape({
    title: Yup.string().required(),
    date: Yup.string().required(),
    description: Yup.string().required(),
    category: Yup.string().required(),
    city: Yup.string().required(),
    venue: Yup.string().required(),
  });

  const handleCancel = () => {
    if (activityStore.error) {
      activityStore.setError(null);
    }
    navigate('/activities', { replace: true });
  };

  const categoryptions = [
    { value: 'drinks', text: 'Drinks' },
    { value: 'calture', text: 'Calture' },
    { value: 'film', text: 'Film' },
    { value: 'food', text: 'Food' },
    { value: 'music', text: 'Music' },
    { value: 'travel', text: 'Travel' },
  ];

  return (
    <Segment clearing>
      <Formik
        enableReinitialize
        initialValues={formData}
        validationSchema={formValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            console.log(values);
            setSubmitting(false);
          }, 2000);
        }}
      >
        {({ touched, isValid, isSubmitting }) => (
          <Form className='ui form error'>
            <AppTextInput name='title' placeholder='Enter title' />
            <AppTextArea
              name='description'
              placeholder='Enter description'
              rows={3}
            />
            <AppSelectInput
              name='category'
              placeholder='Category'
              options={categoryptions}
            />
            <AppDateInput
              name='date'
              options={{
                placeholderText: 'Date',
                showTimeSelect: true,
                timeCaption: 'time',
                dateFormat: 'MMMM d, yyyy h:m aa',
              }}
            />
            <AppTextInput name='city' placeholder='Enter city' />
            <AppTextInput name='venue' placeholder='Enter venue' />

            <Button
              floated='left'
              positive
              type='submit'
              content='Submit'
              loading={activityStore.operationsLoading}
              disabled={
                !isValid ||
                isSubmitting ||
                (Object.keys(touched).length === 0 &&
                  touched.constructor === Object &&
                  !id)
              }
            />
            <Button
              floated='right'
              negative
              type='button'
              content='Cancel'
              onClick={handleCancel}
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
