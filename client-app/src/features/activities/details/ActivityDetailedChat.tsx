import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import { Segment, Header, Comment, Form, Button } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

interface Props {
  activityId: string;
}

const ActivityDetailedChat: FC<Props> = ({ activityId }) => {
  const { commentStore } = useStore();
  const [reply, setReply] = useState('');
  useEffect(() => {
    commentStore.createConnection(activityId);

    //
    return () => {
      commentStore.clearComments();
      commentStore.stopConnection();
    };
  }, [activityId, commentStore]);
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
                    <div>Today at 5:42PM</div>
                  </Comment.Metadata>
                  <Comment.Text>{body}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            ),
          )}

          <Form reply>
            <Form.TextArea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <Button
              content='Add Reply'
              labelPosition='left'
              icon='edit'
              primary
              disabled={!reply}
            />
          </Form>
        </Comment.Group>
      </Segment>
    </>
  );
};

export default observer(ActivityDetailedChat);
