import { useField } from "formik";
import { FC } from "react";
import { Form, Message, TextArea } from "semantic-ui-react";

interface Props {
  label?: string;
  placeholder?: string;
  name: string;
  rows?: number;
}

const AppTextArea: FC<Props> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      {label && <label>{label}</label>}
      <TextArea {...field} {...props} />
      {meta.touched && !!meta.error && <Message error content={meta.error} />}
    </Form.Field>
  );
};

export default AppTextArea;
