import { store } from "./store";
import { ChatComment } from "./../models/comment";
import { makeAutoObservable } from "mobx";
import * as signalR from "@microsoft/signalr";

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
      .withUrl(`${process.env.REACT_APP_CHAT_URL}?activityId=${activityId}`, {
        accessTokenFactory: () => store.authStore.user?.token!,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("--- Connection Started ---"))
      .catch((err) => console.log(err));

    this.hubConnection.on("ListComments", (comments) => {
      console.log(comments);

      this.setComments(comments);
    });

    this.hubConnection.on("ReceiveComment", (comment) => {
      console.log(comment);
      this.addComment(comment);
    });
  };

  stopConnection = () => {
    this.hubConnection
      .stop()
      .then(() => console.log("--- Connection Stopped ---"))
      .catch((err) => console.log(err));
  };

  createComment = async (activityId: string, reply: string) => {
    try {
      await this.hubConnection.invoke("CreateComment", {
        activityId: activityId,
        body: reply,
      });
    } catch (error) {
      console.log(error);
    }
  };

  setComments = (comments: any) => {
    this.comments = comments.map((comment: any) => {
      comment.createdAt = new Date(comment.createdAt + "Z");
      return comment;
    });
  };

  addComment = (comment: any) => {
    comment.createdAt = new Date(comment.createdAt);
    this.comments.unshift(comment);
  };

  clearComments = () => (this.comments = []);
}
