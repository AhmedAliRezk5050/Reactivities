import {ChangeEvent, FC, useEffect, useState} from 'react';
import * as Yup from 'yup';
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

    const formValidationSchema: Yup.SchemaOf<Omit<Activity, 'id'>> = Yup.object().shape({
        title: Yup.string().required(),
        date: Yup.string().required(),
        description: Yup.string().required(),
        category: Yup.string().required(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    });

    return (
        <Formik
            initialValues={formData}
            validationSchema={formValidationSchema}
            onSubmit={(values, {setSubmitting}) => {
                setTimeout(() => {
                    console.log(values);
                    setSubmitting(false);
                }, 2000);
            }}
        >
            {({
                  errors,
                  touched,
                  isSubmitting
              }) => (
                <Form>
                    <Field
                        type='title'
                        name='title'
                    />
                    {errors.title && touched.title &&
                        <div>{errors.title}</div>
                    }
                    <button type='submit' disabled={isSubmitting}>
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    );
};

export default observer(ActivityForm);
