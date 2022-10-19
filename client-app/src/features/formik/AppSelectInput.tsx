import { useField } from 'formik';
import { FC } from 'react';
import { DropdownItemProps, Form, Message, Select } from 'semantic-ui-react';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  options: DropdownItemProps[];
}

const AppSelectInput: FC<Props> = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <Form.Field>
      {label && <label>{label}</label>}
      <Select
        clearable
        {...field}
        {...props}
        options={options}
        error={meta.touched && !!meta.error}
        onBlur={() => helpers.setTouched(true)}
        onChange={(_, data) => helpers.setValue(data.value)}
      />
      {meta.touched && !!meta.error && <Message error content={meta.error} />}
    </Form.Field>
  );
};

export default AppSelectInput;
