import { makeAutoObservable } from 'mobx';

export default class ModalStore {
  modalSatus: boolean = false;
  modalBody: JSX.Element | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openModal(body: JSX.Element) {
    this.modalSatus = true;
    this.modalBody = body;
  }

  closeModal = () => {
    this.modalSatus = false;
    this.modalBody = null;
  };
}
