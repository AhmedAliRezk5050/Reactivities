import { useField } from 'formik';
import { FC } from 'react';
import { Form, Message } from 'semantic-ui-react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

interface Props {
  name: string;
  label?: string;
  options: Omit<ReactDatePickerProps, 'onChange'>;
}

const AppDateInput: FC<Props> = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <Form.Field>
      {label && <label>{label}</label>}
      <DatePicker
        {...options}
        {...props}
        {...field}
        selected={field.value}
        onChange={(date: Date) => helpers.setValue(date)}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && !!meta.error && <Message error content={meta.error} />}
    </Form.Field>
  );
};

export default AppDateInput;
