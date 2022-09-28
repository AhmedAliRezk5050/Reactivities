import {FC} from "react";
import NavBar from "../NavBar/NavBar";
import { Container} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {Outlet} from "react-router-dom";

interface Props {
}


const RootLayout: FC<Props> = () => {
    return (
        <>
            <NavBar/>
            <div className="header-separator"></div>
            <Container>
                <Outlet />
            </Container>
        </>
    );
};

export default observer(RootLayout);
