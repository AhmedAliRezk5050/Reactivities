import { store } from './store';
import { ChatComment } from './../models/comment';
import { makeAutoObservable } from 'mobx';
import * as signalR from '@microsoft/signalr';

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection!: signalR.HubConnection;

  constructor() {
    makeAutoObservable(this);
  }

  createConnection = (activityId: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
        accessTokenFactory: () => store.authStore.user?.token!,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('--- Connection Started ---'))
      .catch((err) => console.log(err));

    this.hubConnection.on('ListComments', (comments) => {
      this.setComments(comments);
    });

    this.hubConnection.on('ReceiveComment', (comment) => {
      this.addComment(comment);
    });
  };

  stopConnection = () => {
    this.hubConnection
      .stop()
      .then(() => console.log('--- Connection Stopped ---'))
      .catch((err) => console.log(err));
  };

  setComments = (comments: any) => {
    this.comments = comments;
  };

  addComment = (comment: any) => {
    this.comments.push(comment);
  };

  clearComments = () => (this.comments = []);
}
