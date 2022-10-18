import { FC } from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
  errors: string[];
}
const ErrorsList: FC<Props> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Message error>
      <Message.List>
        {errors.map((error, index) => (
          <Message.Item key={index}>{error}</Message.Item>
        ))}
      </Message.List>
    </Message>
  );
};

export default ErrorsList;
