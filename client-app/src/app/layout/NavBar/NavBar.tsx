import {Button, Container, Menu} from "semantic-ui-react";
import  './NavBar.css';
import {FC} from "react";
import {useStore} from "../../stores/store";


interface Props {
}

const NavBar:FC<Props> = () => {

    const {activityStore: {setFormVisibility, formVisibility, setSelectedActivity}} = useStore()

    const handleCreate = () => {
        if(!formVisibility) {
            setSelectedActivity(null)
            setFormVisibility(true)
        }
    }

    return (
        <Menu inverted fixed="top" className="NavBar">
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" className="logo"/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button positive content="Create Activity" onClick={handleCreate}/>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default NavBar;