import { observer } from 'mobx-react-lite'
import {FC} from "react";
import Activity from "../../../app/models/activity";
import {Item, Segment, Image, Header, Button} from "semantic-ui-react";


const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}


const ActivityDetailedHeader: FC<Props> = ({activity}) => {
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{activity.date}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button>Join Activity</Button>
                <Button>Cancel attendance</Button>
                <Button floated='right'>
                    Manage Event
                </Button>
            </Segment>
        </Segment.Group>
    );
};

export default observer(ActivityDetailedHeader);
