import {Button, Form, Segment} from "semantic-ui-react";
import {ChangeEvent, FC, useState} from "react";
import Activity from "../../../app/models/activity";
import {useStore} from "../../../app/stores/store";
import {observer} from "mobx-react-lite";

interface Props {

}

const ActivityForm: FC<Props> = () => {

    const {activityStore: {setFormVisibility, upsertActivity, operationsLoading, setError, selectedActivity}} = useStore();


    const [formData, setFormData] = useState<Activity>(selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        venue: '',
        city: ''
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = () => {
        debugger;
        upsertActivity(formData)
    }

    const handleCancel = () => {
        setFormVisibility(false);
        setError(null)
    }


    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    placeholder='Title'
                    name='title'
                    onChange={handleChange}
                    value={formData.title}/>
                <Form.TextArea
                    placeholder='Description'
                    name='description'
                    onChange={handleChange}
                    value={formData.description}/>
                <Form.Input
                    placeholder='Category'
                    name='category'
                    onChange={handleChange}
                    value={formData.category}/>
                <Form.Input
                    placeholder='Date'
                    type='date'
                    name='date'

                    onChange={handleChange}
                    value={formData.date}/>
                <Form.Input
                    placeholder='City'
                    name='city'
                    onChange={handleChange}
                    value={formData.city}/>
                <Form.Input
                    placeholder='Venue'
                    name='venue'
                    onChange={handleChange}
                    value={formData.venue}/>
                <Button floated='left' positive type='submit' content='Submit' loading={operationsLoading}/>
                <Button floated='right' negative type='button' content='Cancel' onClick={handleCancel}/>
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);