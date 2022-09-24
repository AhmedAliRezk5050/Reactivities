import {Button, Form, Segment} from "semantic-ui-react";

const ActivityForm = () => {
    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder='Title'/>
                <Form.TextArea placeholder='Description'/>
                <Form.Input placeholder='Category'/>
                <Form.Input placeholder='Date'/>
                <Form.Input placeholder='City'/>
                <Form.Input placeholder='Venue'/>
                <Button floated='left' positive type='submit' content='Submit'/>
                <Button floated='right' negative type='button' content='Cancel'/>
            </Form>
        </Segment>
    );
};

export default ActivityForm;