import {Button, Container, Menu} from "semantic-ui-react";
import  './NavBar.css';
import {FC} from "react";


interface Props {
    onStartCreate: () => void
}

const NavBar:FC<Props> = ({onStartCreate}) => {
    return (
        <Menu inverted fixed="top" className="NavBar">
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" className="logo"/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button positive content="Create Activity" onClick={() => onStartCreate()}/>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default NavBar;