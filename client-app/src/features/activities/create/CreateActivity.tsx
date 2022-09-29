import {Button, Form, Grid, GridColumn, Segment} from "semantic-ui-react";
import {ChangeEvent, useState} from "react";
import Activity from "../../../app/models/activity";
import {useStore} from "../../../app/stores/store";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const CreateActivity = () => {
    const {activityStore} = useStore();

    const navigate = useNavigate();

    const [formData, setFormData] = useState<Activity>({
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
        activityStore.upsertActivity(formData).finally(() => {
            if(!activityStore.error) navigate('/activities', {replace: true});
        })
    }

    const handleCancel = () => {
        if(activityStore.error) {
            activityStore.setError(null)
        }
        navigate('/activities', {replace: true});
    }

    return (
       <Grid className='centered'>
           <GridColumn width='8'>
               <h2 className='centered' style={{marginBottom: '3rem'}}>Create Activity</h2>
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
                       <Button floated='left' positive type='submit' content='Submit' loading={activityStore.operationsLoading}/>
                       <Button floated='right' negative type='button' content='Cancel' onClick={handleCancel}/>
                   </Form>
               </Segment>
               );

           </GridColumn>
       </Grid>
    );
};

export default observer(CreateActivity);
