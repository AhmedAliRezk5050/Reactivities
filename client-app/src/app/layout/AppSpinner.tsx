import {FC} from "react";
import {Dimmer, Loader} from "semantic-ui-react";

interface Props {
    active?: boolean
}

const AppSpinner:FC<Props> = ({active = true}) => {
    return (
        <Dimmer active={active}>
            <Loader/>
        </Dimmer>
    );
};

export default AppSpinner;
