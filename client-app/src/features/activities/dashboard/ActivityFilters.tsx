import {Header, Menu} from "semantic-ui-react";
import Calendar from "react-calendar";

const ActivityFilters = () => {
    return (
        <>
            <Menu vertical size='large' style={{width: '100%', marginTop: '1.9rem'}}>
                <Header icon='filter' attached content='Filters'/>
                <Menu.Item content='All Activities'/>
                <Menu.Item content="I'm going"/>
                <Menu.Item content="I'm hosting"/>
            </Menu>
            <Header />
            <Calendar />
        </>
    );
};

export default ActivityFilters;
