import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import "./NavBar.css";
import { FC } from "react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../stores/store";

interface Props {}

const NavBar: FC<Props> = () => {
  const {
    authStore: { user, logout },
  } = useStore();

  return (
    <Menu inverted fixed="top" className="NavBar">
      <Container>
        <Menu.Item header as={NavLink} to="/home">
          <img src="/assets/logo.png" alt="logo" className="logo" />
          Reactivities
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to="/activities" end />
        <Menu.Item as={NavLink} to="/activities/create" end>
          <Button content="Create Activity" />
        </Menu.Item>
        <Menu.Item position="right">
          <Image
            src={user?.image || "/assets/user.png"}
            avatar
            spaced="right"
          />

          <Dropdown text={user?.displayName} pointing="top left">
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to={`/profile/${user?.userName}`}>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => logout()}
                icon="power"
                text="Logout"
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
