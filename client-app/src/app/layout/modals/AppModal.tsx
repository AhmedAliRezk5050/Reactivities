import { observer } from 'mobx-react-lite';
import { Modal } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

const AppModal = () => {
  const { modalStore } = useStore();

  return (
    <Modal
      open={modalStore.modalSatus}
      onClose={modalStore.closeModal}
      size='mini'
      closeIcon
    >
      <Modal.Content>{modalStore.modalBody}</Modal.Content>
    </Modal>
  );
};

export default observer(AppModal);
