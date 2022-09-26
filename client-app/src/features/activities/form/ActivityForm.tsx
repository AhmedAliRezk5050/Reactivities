import {Button, Form, Segment} from "semantic-ui-react";
import {ChangeEvent, FC, useState} from "react";
import Activity from "../../../app/models/activity";

interface Props {
    activity: Activity | null,
    onCancel: (id?: string) => void,
    onUpsertActivity: (activity: Activity) => void
}

const ActivityForm: FC<Props> = ({onCancel, activity, onUpsertActivity}) => {
    console.log(activity)
    const [formData, setFormData] = useState<Activity>(activity ?? {
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
        onUpsertActivity(formData);
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
                    type='data'
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
                <Button floated='left' positive type='submit' content='Submit'/>
                <Button floated='right' negative type='button' content='Cancel' onClick={() => onCancel(activity?.id)}/>
            </Form>
        </Segment>
    );
};

export default ActivityForm;