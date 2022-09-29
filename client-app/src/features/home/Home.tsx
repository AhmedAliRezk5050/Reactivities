import {Link} from "react-router-dom";
import {Container, Grid} from "semantic-ui-react";

const Home = () => {
    return (
        <Container>
            <Grid>
                <Grid.Column>
                    <h1>Home page</h1>
                    <Link to='activities'> Go To Activities</Link>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default Home;
