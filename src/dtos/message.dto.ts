import { Group } from "../models";

export interface ISendMessageRequest {
  sender: string;
  receiver: string;
  message: string;
  group: string;
}

export const SendMessageResponseFields = {
  id: undefined,
  sender: undefined,
  receiver: undefined,
  message: undefined,
  group: undefined,
};

export interface ISendMessageResponse {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  group: Group;
}

export interface IDeleteMessageRequest {
  id: string;
}

export const DeleteMessageResponseFields = {
  id: undefined,
};

export interface IDeleteMessageResponse {
  id: string;
}

export interface IGetMessagesRequest {
  sender: string;
  receiver: string;
  group: string;
}

export const GetMessagesResponseFields = {
  id: undefined,
  sender: undefined,
  receiver: undefined,
  message: undefined,
  group: undefined,
};

export interface IGetMessagesResponse {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  group: string;
}
