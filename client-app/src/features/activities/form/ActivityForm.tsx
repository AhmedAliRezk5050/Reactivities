import {Button, Form, Segment} from "semantic-ui-react";
import {FC} from "react";
import Activity from "../../../app/models/activity";

interface Props {
    activity: Activity | null,
    onCancel: (id?: string) => void
}

const ActivityForm: FC<Props> = ({onCancel, activity}) => {
    console.log(
        activity
    )
    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder='Title' content={activity?.title}/>
                <Form.TextArea placeholder='Description'/>
                <Form.Input placeholder='Category'/>
                <Form.Input placeholder='Date'/>
                <Form.Input placeholder='City'/>
                <Form.Input placeholder='Venue'/>
                <Button floated='left' positive type='submit' content='Submit'/>
                <Button floated='right' negative type='button' content='Cancel' onClick={() => onCancel(activity?.id)}/>
            </Form>
        </Segment>
    );
};

export default ActivityForm;