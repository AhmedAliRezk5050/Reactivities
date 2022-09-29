import {Button, Container, Menu} from "semantic-ui-react";
import  './NavBar.css';
import {FC} from "react";
import {observer} from "mobx-react-lite";
import {NavLink} from "react-router-dom";


interface Props {
}

const NavBar:FC<Props> = () => {
    return (
        <Menu inverted fixed="top" className="NavBar">
            <Container>
                <Menu.Item header as={NavLink} to='/'>
                    <img src="/assets/logo.png" alt="logo" className="logo"/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities"
                           as={NavLink} to='activities'
                            end
                           />
                <Menu.Item as={NavLink} to='activities/create' end>
                    <Button positive content="Create Activity"/>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default observer(NavBar);