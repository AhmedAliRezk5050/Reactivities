import { useField } from 'formik';
import { FC } from 'react';
import { Form, Message } from 'semantic-ui-react';

interface Props {
  label?: string;
  placeholder?: string;
  name: string;
  type?: string;
}

const AppTextInput: FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <Form.Input
        {...field}
        {...props}
        label={label}
        error={meta.touched && !!meta.error}
      />
      {meta.touched && !!meta.error && <Message error content={meta.error} />}
    </>
  );
};

export default AppTextInput;
