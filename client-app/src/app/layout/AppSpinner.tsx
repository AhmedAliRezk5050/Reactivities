import { FC } from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  active?: boolean;
  text?: string;
}

const AppSpinner: FC<Props> = ({ active = true, text }) => {
  return (
    <Dimmer active={active} page>
      <Loader content={text} />
    </Dimmer>
  );
};

export default AppSpinner;
