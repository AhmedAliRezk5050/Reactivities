import {FC, ReactNode} from "react";
import NavBar from "../NavBar/NavBar";
import {Button, Container, Message} from "semantic-ui-react";
import {useStore} from "../../stores/store";
import {observer} from "mobx-react-lite";
import AppSpinner from "../AppSpinner";

interface Props {
    children?: ReactNode;
}


const RootLayout: FC<Props> = ({children}) => {

    const {activityStore: {error, setError}} = useStore()

    return (
        <>
            <NavBar/>
            <div className="header-separator"></div>
            <Container>
                {error && <Message warning className='message'>
                    <Message.Header>{error.title}</Message.Header>
                    <p>{error.message}</p>
                    <Button icon='close' className='msg-close' onClick={() => setError(null)}/>
                </Message>}



                {children}
            </Container>
        </>
    );
};

export default observer(RootLayout);
