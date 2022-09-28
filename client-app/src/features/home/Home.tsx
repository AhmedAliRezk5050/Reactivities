import {Link} from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1>Home page</h1>
            <Link to='activities'> Go To Activities</Link>
        </>
    );
};

export default Home;
