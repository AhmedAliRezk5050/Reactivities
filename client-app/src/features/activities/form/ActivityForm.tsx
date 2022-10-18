import { Button, Form, Segment } from 'semantic-ui-react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import Activity from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import AppSpinner from '../../../app/layout/AppSpinner';
import ErrorsList from '../../errors/ErrorsList';

interface Props {}

const ActivityForm: FC<Props> = () => {
  const { activityStore } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [localLoading, setLocalLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<Activity>({
    id: '',
    title: '',
    date: '',
    description: '',
    category: '',
    venue: '',
    city: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    activityStore
      .upsertActivity(formData)
      .catch((e: string[]) => {
        setFormErrors(e);
        console.error(e);
      })
      .finally(() => {
        if (!activityStore.error) navigate('/activities', { replace: true });
      });
  };

  const handleCancel = () => {
    if (activityStore.error) {
      activityStore.setError(null);
    }
    navigate('/activities', { replace: true });
  };

  useEffect(() => {
    if (id) {
      activityStore
        .fetchActivity(id)
        .then(() => {
          if (activityStore.activity) {
            setFormData(activityStore.activity);
          }
        })
        .finally(() => setLocalLoading(false));
    } else {
      setFormData({
        id: '',
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

  return (
    <Segment clearing>
      <ErrorsList errors={formErrors} />
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder='Title'
          name='title'
          onChange={handleChange}
          value={formData.title}
        />
        <Form.TextArea
          placeholder='Description'
          name='description'
          onChange={handleChange}
          value={formData.description}
        />
        <Form.Input
          placeholder='Category'
          name='category'
          onChange={handleChange}
          value={formData.category}
        />
        <Form.Input
          placeholder='Date'
          type='date'
          name='date'
          onChange={handleChange}
          value={formData.date}
        />
        <Form.Input
          placeholder='City'
          name='city'
          onChange={handleChange}
          value={formData.city}
        />
        <Form.Input
          placeholder='Venue'
          name='venue'
          onChange={handleChange}
          value={formData.venue}
        />
        <Button
          floated='left'
          positive
          type='submit'
          content='Submit'
          loading={activityStore.operationsLoading}
        />
        <Button
          floated='right'
          negative
          type='button'
          content='Cancel'
          onClick={handleCancel}
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
