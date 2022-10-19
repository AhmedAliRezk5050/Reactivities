import {ChangeEvent, FC, useEffect, useState} from 'react';
import Activity from '../../../app/models/activity';
import {useStore} from '../../../app/stores/store';
import {observer} from 'mobx-react-lite';
import {useNavigate, useParams} from 'react-router-dom';
import AppSpinner from '../../../app/layout/AppSpinner';
import ErrorsList from '../../errors/ErrorsList';
import {Field, Form, Formik} from 'formik';

interface Props {
}

const ActivityForm: FC<Props> = () => {
    const {activityStore} = useStore();
    const navigate = useNavigate();
    const {id} = useParams();
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

    // const handleChange = (
    //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    // ) => {
    //   const { name, value } = e.target;
    //   setFormData({ ...formData, [name]: value });
    // };

    // const handleSubmit = () => {
    //   activityStore
    //     .upsertActivity(formData)
    //     .catch((e: string[]) => {
    //       if (Array.isArray(e)) setFormErrors(e);
    //     })
    //     .finally(() => {
    //       if (!activityStore.error) navigate('/activities', { replace: true });
    //     });
    // };

    const handleCancel = () => {
        if (activityStore.error) {
            activityStore.setError(null);
        }
        navigate('/activities', {replace: true});
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
        return <AppSpinner active={activityStore.activityLoading}/>;

    return (
        <Formik
            initialValues={formData}
            onSubmit={(values, {setSubmitting}) => {
                setTimeout(() => {
                    console.log(values);
                    setSubmitting(false);
                }, 2000);
            }}
        >
            {({isSubmitting}) => (
                <Form>
                    <Field
                        type='title'
                        name='title'
                    />
                    <button type='submit' disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default observer(ActivityForm);
