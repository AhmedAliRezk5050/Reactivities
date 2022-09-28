import React from 'react';
import {Grid} from "semantic-ui-react";
import {Link} from "react-router-dom";

const NotFound = () => {
    return (
        <Grid className='centered'>
            <Grid.Column>
                <h3>Page is not found. back to
                    <Link to='/activities'>Activities</Link>
                </h3>
            </Grid.Column>
        </Grid>
    );
};

export default NotFound;
