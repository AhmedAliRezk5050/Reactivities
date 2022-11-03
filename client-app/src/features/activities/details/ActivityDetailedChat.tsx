import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { Segment, Header, Comment, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  activityId: string;
}

const ActivityDetailedChat: FC<Props> = ({ activityId }) => {
  const { commentStore } = useStore();
  useEffect(() => {
    commentStore.createConnection(activityId);

    //
    return () => {
      commentStore.clearComments();
      commentStore.stopConnection();
    };
  }, [activityId, commentStore]);

  const formValidationSchema: Yup.SchemaOf<{ body: string }> =
    Yup.object().shape({
      body: Yup.string().required("Can't send empty comment"),
    });
  return (
    <>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {commentStore.comments.map(
            ({ id, body, createdAt, displayName, image, username }) => (
              <Comment key={id}>
                <Comment.Avatar src={image} />
                <Comment.Content>
                  <Comment.Author as='a'>{displayName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistanceToNow(createdAt)} ago</div>
                  </Comment.Metadata>
                  <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>
                    {body}
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            ),
          )}
          <Formik
            validationSchema={formValidationSchema}
            initialValues={{ body: '' }}
            onSubmit={(values, { resetForm }) =>
              commentStore
                .createComment(activityId, values.body)
                .then(() => resetForm())
            }
          >
            {({ touched, isValid, isSubmitting, handleSubmit }) => (
              <Form className='ui form error'>
                <Field name='body'>
                  {(props: FieldProps) => (
                    <div style={{ position: 'relative' }}>
                      <Loader active={isSubmitting} />
                      <textarea
                        placeholder='Enter your comment (Enter to submit, Shift + Enter for new line)'
                        rows={2}
                        {...props.field}
                        onKeyPress={(e) => {
                          // todo validation => empty comment
                          if (e.key === 'Enter' && e.shiftKey) {
                            return;
                          }
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            isValid && handleSubmit();
                          }
                        }}
                      />
                    </div>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
};

export default observer(ActivityDetailedChat);
